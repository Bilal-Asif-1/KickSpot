import { Router } from 'express'
import { login, loginValidators, register, registerValidators } from '@/controllers/auth.controller'

const r = Router()
r.post('/register', registerValidators, register)
r.post('/login', loginValidators, login)

export default r


