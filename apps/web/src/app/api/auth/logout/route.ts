import { NextResponse } from 'next/server'

import {
  ACCESS_TOKEN_COOKIE,
  accessTokenCookieOptions,
} from '@/lib/server/session-cookie'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ACCESS_TOKEN_COOKIE, '', {
    ...accessTokenCookieOptions(),
    maxAge: 0,
  })
  return res
}
