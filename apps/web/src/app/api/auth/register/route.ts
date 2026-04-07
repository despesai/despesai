import { NextResponse } from 'next/server'

import { getBackendBaseUrl } from '@/lib/server/backend-env'
import {
  ACCESS_TOKEN_COOKIE,
  accessTokenCookieOptions,
} from '@/lib/server/session-cookie'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const base = getBackendBaseUrl()
  const res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data: Record<string, unknown> = await res.json().catch(() => ({}))
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  const token = data.token
  if (typeof token !== 'string') {
    return NextResponse.json(
      { error: 'Invalid response from auth server' },
      { status: 502 },
    )
  }

  const { token: _t, ...publicUser } = data
  const response = NextResponse.json(publicUser, { status: 201 })
  response.cookies.set(ACCESS_TOKEN_COOKIE, token, accessTokenCookieOptions())
  return response
}
