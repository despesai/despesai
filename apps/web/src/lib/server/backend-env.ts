export function getBackendBaseUrl(): string {
  const u = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (u) {
    return u.replace(/\/$/, '')
  }
  return 'http://localhost:3002'
}

export function getJwtSecret(): string {
  const s = process.env.JWT_SECRET
  if (!s) {
    throw new Error('JWT_SECRET is not set')
  }
  return s
}
