import { Router } from 'express'

import { HttpError } from '../lib/http-error'
import * as userRepo from '../repositories/user.repository'

const router = Router()

router.get('/:id', async (req, res, next) => {
  try {
    const user = await userRepo.findUserByIdPublic(req.params.id)
    if (!user) {
      throw new HttpError(404, 'User not found')
    }
    res.status(200).json(user)
  } catch (e) {
    next(e)
  }
})

export default router
