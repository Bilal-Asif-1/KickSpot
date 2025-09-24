import { Request, Response } from 'express'
import { User } from '../models/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { NotificationService } from '../services/notificationService.js'
import { sequelize } from '../lib/sequelize.js'

export const registerValidators = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['buyer', 'seller']),
  // Common fields for both buyers and sellers
  body('contactNumber').isString().isLength({ min: 10 }),
  body('deliveryAddress').optional().isString(),
  // Seller-specific fields (optional)
  body('businessAddress').optional().isString(),
  body('cnicNumber').optional().isString(),
  body('bankAccountNumber').optional().isString(),
  body('bankName').optional().isString(),
]

/**
 * 🚀 USER REGISTRATION WITH ACID PROPERTIES IMPLEMENTATION
 * 
 * ATOMICITY: All operations wrapped in database transaction
 * CONSISTENCY: Data validation and business rules enforced
 * ISOLATION: Row-level locking to prevent duplicate registrations
 * DURABILITY: Proper error handling and logging
 */
export async function register(req: Request, res: Response) {
  console.log('📥 REGISTRATION REQUEST RECEIVED')
  console.log('Request body:', req.body)
  
  // ✅ ATOMICITY: Start database transaction
  const transaction = await sequelize.transaction()
  
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array())
      throw new Error('Validation failed: ' + errors.array().map(e => e.msg).join(', '))
    }
  
    const { 
      name, 
      email, 
      password, 
      role = 'buyer',
      // Common fields for both buyers and sellers
      contactNumber,
      deliveryAddress,
      // Seller-specific fields (optional)
      businessAddress,
      cnicNumber,
      bankAccountNumber,
      bankName
    } = req.body

    // ✅ CONSISTENCY: Validate input data and business rules
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long')
    }
    
    if (!email || !email.includes('@')) {
      throw new Error('Valid email address is required')
    }
    
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }
    
    if (!contactNumber || contactNumber.length < 10) {
      throw new Error('Valid contact number is required')
    }

    // Custom validation: delivery address required for buyers, not for sellers
    if (role === 'buyer' && (!deliveryAddress || deliveryAddress.trim().length < 10)) {
      throw new Error('Delivery address is required for customers')
    }

    // Custom validation: seller fields required for sellers
    if (role === 'seller') {
      if (!businessAddress || businessAddress.trim().length === 0) {
        throw new Error('Business address is required for sellers')
      }
      if (!cnicNumber || cnicNumber.trim().length === 0) {
        throw new Error('CNIC number is required for sellers')
      }
      if (!bankAccountNumber || bankAccountNumber.trim().length === 0) {
        throw new Error('Bank account number is required for sellers')
      }
      if (!bankName || bankName.trim().length === 0) {
        throw new Error('Bank name is required for sellers')
      }
    }
    
    // ✅ ISOLATION: Check for existing email with lock to prevent race conditions
    const existing = await User.findOne({ 
      where: { email },
      lock: true, // Row-level locking for isolation
      transaction 
    })
    if (existing) {
      console.log('❌ Email already exists:', email)
      throw new Error('Email already in use')
    }
    
    console.log('🔐 Hashing password...')
    const hash = await bcrypt.hash(password, 10)
    
    console.log('👤 Creating user with data:', {
      name, email, role, contactNumber,
      deliveryAddress: role === 'buyer' ? deliveryAddress : 'N/A for seller',
      businessAddress: role === 'seller' ? businessAddress : 'N/A for customer',
      cnicNumber, bankAccountNumber, bankName
    })
    
    // ✅ ATOMICITY: Create user within transaction
    const user = await User.create({ 
      name, 
      email, 
      password: hash, 
      role,
      // Common fields
      contactNumber,
      // Delivery address only for buyers, business address for sellers
      ...(role === 'buyer' && deliveryAddress && { deliveryAddress }),
      ...(role === 'seller' && businessAddress && { businessAddress }),
      // Seller-specific fields (only if provided)
      ...(cnicNumber && { cnicNumber }),
      ...(bankAccountNumber && { bankAccountNumber }),
      ...(bankName && { bankName })
    }, { transaction })
    
    console.log('✅ User created successfully:', user.id)
    
    // ✅ DURABILITY: Commit transaction - user is now permanent
    await transaction.commit()
    console.log(`🎉 User registration transaction committed successfully for user ${user.id}`)
    
    // Generate JWT token for automatic login
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )
    
    console.log('🔑 Token generated for new user')
    
    // ✅ DURABILITY: Log successful registration
    console.log(`📊 Registration Summary: ID=${user.id}, Name=${name}, Email=${email}, Role=${role}`)
    
    return res.status(201).json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      contactNumber: user.contactNumber,
      deliveryAddress: user.deliveryAddress,
      businessAddress: user.businessAddress,
      cnicNumber: user.cnicNumber,
      bankAccountNumber: user.bankAccountNumber,
      bankName: user.bankName,
      token, // Include token for automatic login
      message: 'User registered successfully with ACID properties'
    })
    
  } catch (error: any) {
    // ✅ ATOMICITY: Rollback transaction on any error
    await transaction.rollback()
    
    // ✅ DURABILITY: Log error for debugging
    console.error('❌ User registration transaction failed:', error.message)
    console.error('🔄 Transaction rolled back successfully')
    
    // Handle specific database errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        message: 'Email already in use',
        error: 'DUPLICATE_EMAIL'
      })
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors.map((err: any) => ({
          field: err.path,
          message: err.message
        }))
      })
    }
    
    res.status(500).json({ 
      message: 'User registration failed',
      error: error.message,
      details: 'Transaction rolled back - no partial data created'
    })
  }
}

export const loginValidators = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
]

export async function login(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  
  // Create login notification
  try {
    await NotificationService.createLoginNotification(user.id, user.role, {
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to create login notification:', error)
    // Don't fail login if notification fails
  }
  
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}

export async function me(req: Request, res: Response) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: number; role: 'seller' | 'buyer' }
    const user = await User.findByPk(payload.id)
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    return res.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      contactNumber: user.contactNumber,
      deliveryAddress: user.deliveryAddress,
      businessAddress: user.businessAddress,
      cnicNumber: user.cnicNumber,
      bankAccountNumber: user.bankAccountNumber,
      bankName: user.bankName
    })
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}


