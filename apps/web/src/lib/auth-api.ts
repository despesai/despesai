import { ApiError, type ApiErrorBody } from './api-error'

export type SessionUserDTO = {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

async function parseJson(res: Response): Promise<unknown> {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

export async function bffAuthPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new ApiError(res.status, data as ApiErrorBody)
  }
  return data as T
}

export function loginRequest(body: { email: string; password: string }) {
  return bffAuthPost<SessionUserDTO>('/api/auth/login', body)
}

export function registerRequest(body: {
  name: string
  email: string
  password: string
}) {
  return bffAuthPost<SessionUserDTO>('/api/auth/register', body)
}

export async function fetchSessionUser(): Promise<SessionUserDTO | null> {
  const res = await fetch('/api/auth/me', { credentials: 'include' })
  if (res.status === 401) {
    return null
  }
  if (!res.ok) {
    return null
  }
  return res.json() as Promise<SessionUserDTO>
}

export async function logoutRequest(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
}
