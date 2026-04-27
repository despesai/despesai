import { type RequestHandler } from 'express'
import { HttpError } from '../lib/http-error'
import { verifyAccessToken } from '../lib/jwt'

const BEARER_PREFIX = 'Bearer '

export const requireAuth: RequestHandler = (req, _res, next) => {
  let token: string | undefined

  const authHeader = req.headers.authorization
  if (authHeader?.startsWith(BEARER_PREFIX)) {
    token = authHeader.slice(BEARER_PREFIX.length).trim()
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/despesai_access_token=([^;]+)/)
    if (match) {
      token = match[1]
    }
  }

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
