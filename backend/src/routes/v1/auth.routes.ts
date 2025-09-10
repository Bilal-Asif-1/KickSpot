import { Router } from 'express'
import { login, loginValidators, register, registerValidators, me } from '../../controllers/auth.controller.js'

const r = Router()
r.post('/register', registerValidators, register)
r.post('/login', loginValidators, login)
r.get('/me', me)

export default r


