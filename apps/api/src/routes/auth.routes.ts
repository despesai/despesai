import { type RequestHandler, Router } from 'express'

import * as authService from '../services/auth.service'

export const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json(result)
  } catch (e) {
    next(e)
  }
}

export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.status(200).json(result)
  } catch (e) {
    next(e)
  }
}

const router = Router()
router.post('/register', registerHandler)
router.post('/login', loginHandler)

export default router
