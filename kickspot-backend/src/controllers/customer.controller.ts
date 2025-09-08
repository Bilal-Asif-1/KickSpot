import { Request, Response } from 'express'
import { User } from '@/models'
import { param, validationResult } from 'express-validator'

export async function listCustomers(_req: Request, res: Response) {
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'created_at'] as any })
  res.json(users)
}

export const getCustomerValidators = [param('id').isInt()]
export async function getCustomer(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const user = await User.findByPk(req.params.id, { attributes: ['id', 'name', 'email', 'role', 'created_at'] as any })
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json(user)
}

export const deleteCustomerValidators = [param('id').isInt()]
export async function deleteCustomer(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json({ message: 'Not found' })
  await user.destroy()
  res.status(204).send()
}


