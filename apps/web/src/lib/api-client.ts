import { getApiBaseUrl } from './api-config'
import { ApiError, type ApiErrorBody } from './api-error'

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const base = getApiBaseUrl()
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  let data: unknown = {}
  try {
    data = await res.json()
  } catch {
    /* empty */
  }

  if (!res.ok) {
    throw new ApiError(res.status, data as ApiErrorBody)
  }

  return data as T
}
