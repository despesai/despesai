import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getBackendBaseUrl, getJwtSecret } from '@/lib/server/backend-env'
import { ACCESS_TOKEN_COOKIE } from '@/lib/server/session-cookie'

type JwtPayload = jwt.JwtPayload & { sub?: string }

export async function GET() {
  let secret: string
  try {
    secret = getJwtSecret()
  } catch {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: JwtPayload
  try {
    payload = jwt.verify(token, secret) as JwtPayload
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = payload.sub
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const base = getBackendBaseUrl()
  const res = await fetch(`${base}/user/${id}`)
  if (!res.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await res.json()
  return NextResponse.json(user)
}
