import { API_BASE_URL } from '../config/env'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function requestJson<T>(
  path: string,
  signal?: AbortSignal,
  baseUrl: string = API_BASE_URL,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { signal })

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed`, response.status)
  }

  return (await response.json()) as T
}
