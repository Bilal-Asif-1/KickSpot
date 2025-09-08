import { Request, Response } from 'express'
import { Product } from '@/models'
import { body, param, validationResult } from 'express-validator'

export const createProductValidators = [
  body('name').isString().notEmpty(),
  body('category').isIn(['Men', 'Women', 'Kids']),
  body('price').isFloat({ gt: 0 }),
  body('stock').isInt({ min: 0 }),
  body('description').optional().isString(),
  body('image_url').optional().isString(),
]

export async function createProduct(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const product = await Product.create(req.body)
  res.status(201).json(product)
}

export const updateProductValidators = [
  param('id').isInt(),
  body('price').optional().isFloat({ gt: 0 }),
  body('stock').optional().isInt({ min: 0 }),
]

export async function updateProduct(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { id } = req.params
  const product = await Product.findByPk(id)
  if (!product) return res.status(404).json({ message: 'Not found' })
  await product.update(req.body)
  res.json(product)
}

export const deleteProductValidators = [param('id').isInt()]

export async function deleteProduct(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { id } = req.params
  const product = await Product.findByPk(id)
  if (!product) return res.status(404).json({ message: 'Not found' })
  await product.destroy()
  res.status(204).send()
}

export async function listProducts(_req: Request, res: Response) {
  const products = await Product.findAll()
  res.json(products)
}

export async function getProduct(req: Request, res: Response) {
  const { id } = req.params
  const product = await Product.findByPk(id)
  if (!product) return res.status(404).json({ message: 'Not found' })
  res.json(product)
}


