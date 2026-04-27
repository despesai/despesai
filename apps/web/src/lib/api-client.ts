import { error } from 'console'

import { getApiBaseUrl } from './api-config'
import { ApiError, type ApiErrorBody } from './api-error'

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const base = getApiBaseUrl()
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  let data: unknown = {}
  try {
    data = await res.json()
  } catch (error) {
    console.error('Erro ao processar resposta JSON da API', error)
  }

  if (!res.ok) {
    throw new ApiError(res.status, data as ApiErrorBody)
  }

  return data as T
}

export const apiClient = {
  get: async (path: string) => {
    const base = getApiBaseUrl()
    const res = await fetch(`${base}${path}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    let data: any = {}
    try {
      data = await res.json()
    } catch {}

    if (!res.ok) {
      throw new ApiError(res.status, data as ApiErrorBody)
    }

    return { data }
  },

  post: async (path: string, body: unknown) => {
    const data = await apiPost<any>(path, body)
    return { data }
  },

  delete: async (path: string) => {
    const base = getApiBaseUrl()
    const res = await fetch(`${base}${path}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    let data: any = {}
    try {
      data = await res.json()
    } catch {}

    if (!res.ok) {
      throw new ApiError(res.status, data as ApiErrorBody)
    }

    return { data }
  },

  put: async (path: string, body: unknown) => {
    const base = getApiBaseUrl()
    const res = await fetch(`${base}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })

    let data: any = {}
    try {
      data = await res.json()
    } catch {}
    if (!res.ok) throw new ApiError(res.status, data as ApiErrorBody)
    return { data }
  },
}

export async function apiGet<T>(path: string): Promise<T> {
  const base = getApiBaseUrl()
  const res = await fetch(`${base}${path}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  let data: unknown = {}
  try {
    data = await res.json()
  } catch (error) {
    console.error('Erro ao processar resposta JSON da API', error)
  }

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new ApiError(res.status, data as ApiErrorBody)
  }

  return data as T
}

export async function apiDelete<T>(path: string): Promise<T> {
  const base = getApiBaseUrl()
  const res = await fetch(`${base}${path}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  let data: unknown = {}
  try {
    const text = await res.text()
    if (text) data = JSON.parse(text)
  } catch (error) {
    console.error('Falha ao processar JSON:', error)
  }

  if (!res.ok) {
    console.warn(`Requisição DELETE para ${path} retornou status ${res.status}`)
    throw new ApiError(res.status, data as ApiErrorBody)
  }

  return data as T
}
