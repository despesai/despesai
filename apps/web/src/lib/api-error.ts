export type ApiErrorBody = {
  error?: string
  details?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly body: ApiErrorBody

  constructor(status: number, body: ApiErrorBody) {
    super(body.error ?? 'Request failed')
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.body.error ?? 'Algo deu errado. Tente novamente.'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Algo deu errado. Tente novamente.'
}
