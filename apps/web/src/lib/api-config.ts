export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (url) {
    return url.replace(/\/$/, '')
  }
  return 'http://localhost:3002'
}
