import jwt from 'jsonwebtoken'

export type AccessTokenPayload = {
  sub: string
  email: string
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }
  return secret
}

export function signAccessToken(payload: {
  sub: string
  email: string
}): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' })
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, getSecret()) as jwt.JwtPayload & {
    email?: unknown
  }
  const sub = decoded.sub
  const email = decoded.email
  if (typeof sub !== 'string' || typeof email !== 'string') {
    throw new Error('Invalid token payload')
  }
  return { sub, email }
}
