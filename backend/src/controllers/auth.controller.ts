import { Request, Response } from 'express'
import { User } from '../models/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'

export const registerValidators = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'admin']),
  // Common fields for both buyers and sellers
  body('contactNumber').isString().isLength({ min: 10 }),
  body('deliveryAddress').optional().isString(),
  // Seller-specific fields (optional)
  body('businessAddress').optional().isString(),
  body('cnicNumber').optional().isString(),
  body('bankAccountNumber').optional().isString(),
  body('bankName').optional().isString(),
]

export async function register(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  
  const { 
    name, 
    email, 
    password, 
    role = 'user',
    // Common fields for both buyers and sellers
    contactNumber,
    deliveryAddress,
    // Seller-specific fields (optional)
    businessAddress,
    cnicNumber,
    bankAccountNumber,
    bankName
  } = req.body

  // Custom validation: delivery address required for customers, not for sellers
  if (role === 'user' && (!deliveryAddress || deliveryAddress.trim().length < 10)) {
    return res.status(400).json({ 
      message: 'Delivery address is required for customers',
      errors: [{ field: 'deliveryAddress', message: 'Delivery address is required for customers' }]
    })
  }

  // Custom validation: seller fields required for sellers
  if (role === 'admin') {
    if (!businessAddress || businessAddress.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Business address is required for sellers',
        errors: [{ field: 'businessAddress', message: 'Business address is required for sellers' }]
      })
    }
    if (!cnicNumber || cnicNumber.trim().length === 0) {
      return res.status(400).json({ 
        message: 'CNIC number is required for sellers',
        errors: [{ field: 'cnicNumber', message: 'CNIC number is required for sellers' }]
      })
    }
    if (!bankAccountNumber || bankAccountNumber.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Bank account number is required for sellers',
        errors: [{ field: 'bankAccountNumber', message: 'Bank account number is required for sellers' }]
      })
    }
    if (!bankName || bankName.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Bank name is required for sellers',
        errors: [{ field: 'bankName', message: 'Bank name is required for sellers' }]
      })
    }
  }
  
  const existing = await User.findOne({ where: { email } })
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' })
  }
  
  const hash = await bcrypt.hash(password, 10)
  
  const user = await User.create({ 
    name, 
    email, 
    password: hash, 
    role,
    // Common fields
    contactNumber,
    // Delivery address only for customers, business address for sellers
    ...(role === 'user' && deliveryAddress && { deliveryAddress }),
    ...(role === 'admin' && businessAddress && { businessAddress }),
    // Seller-specific fields (only if provided)
    ...(cnicNumber && { cnicNumber }),
    ...(bankAccountNumber && { bankAccountNumber }),
    ...(bankName && { bankName })
  })
  
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
    bankName: user.bankName
  })
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
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}

export async function me(req: Request, res: Response) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: number; role: 'admin' | 'user' }
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


