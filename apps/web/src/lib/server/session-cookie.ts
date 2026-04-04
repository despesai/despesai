export const ACCESS_TOKEN_COOKIE = 'despesai_access_token'

export function accessTokenCookieOptions() {
  return {
    httpOnly: true as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  }
}
