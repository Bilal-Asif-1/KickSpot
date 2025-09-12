import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { createPaymentIntent, confirmPayment, webhook } from '../controllers/payment.controller.js'

const router = Router()

// Webhook endpoint (no auth required)
router.post('/webhook', webhook)

// Protected routes
router.post('/create-payment-intent', authenticate, createPaymentIntent)
router.post('/confirm-payment', authenticate, confirmPayment)

export default router
