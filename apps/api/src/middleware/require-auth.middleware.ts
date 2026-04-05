import { type RequestHandler } from 'express'

import { HttpError } from '../lib/http-error'
import { verifyAccessToken } from '../lib/jwt'

const BEARER_PREFIX = 'Bearer '

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith(BEARER_PREFIX)) {
    next(new HttpError(401, 'Authentication required'))
    return
  }
  const token = header.slice(BEARER_PREFIX.length).trim()
  if (!token) {
    next(new HttpError(401, 'Authentication required'))
    return
  }
  try {
    const payload = verifyAccessToken(token)
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    next(new HttpError(401, 'Invalid or expired token'))
  }
}
