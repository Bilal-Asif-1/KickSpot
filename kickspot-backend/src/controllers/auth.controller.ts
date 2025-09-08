import { Request, Response } from 'express'
import { User } from '@/models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'

export const registerValidators = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'seller', 'admin']),
]

export async function register(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { name, email, password, role = 'user' } = req.body
  const existing = await User.findOne({ where: { email } })
  if (existing) return res.status(409).json({ message: 'Email already in use' })
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hash, role })
  return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role })
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


