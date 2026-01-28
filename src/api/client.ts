import { API_BASE_URL } from '@/constants/api'

export interface ApiResponse<T> {
  data: T
  requestId?: string
}

export interface ApiErrorPayload {
  message: string
  code?: string
  status?: number
  requestId?: string
  details?: unknown
}

export class ApiError extends Error {
  code?: string
  status?: number
  requestId?: string
  details?: unknown

  constructor(payload: ApiErrorPayload) {
    super(payload.message)
    this.name = 'ApiError'
    this.code = payload.code
    this.status = payload.status
    this.requestId = payload.requestId
    this.details = payload.details
  }
}

const toApiError = (response: Response, requestId: string | undefined, details: unknown): ApiError => {
  const payload = details as { message?: string; error?: { message?: string; code?: string }; code?: string }
  const message = payload?.message ?? payload?.error?.message ?? (response.statusText || 'Request failed')
  const code = payload?.code ?? payload?.error?.code

  return new ApiError({
    message,
    code,
    status: response.status,
    requestId,
    details,
  })
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError

export async function fetchJson<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  if (!API_BASE_URL) {
    throw new ApiError({ message: 'API_BASE_URL is not configured' })
  }

  const headers = new Headers(options.headers ?? {})
  const hasBody = options.body !== undefined && options.body !== null
  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const requestId = response.headers.get('x-request-id') ?? undefined
  const contentType = response.headers.get('content-type') ?? ''
  let payload: unknown = null

  if (contentType.includes('application/json')) {
    payload = await response.json()
  } else if (response.status !== 204) {
    payload = await response.text()
  }

  if (!response.ok) {
    throw toApiError(response, requestId, payload)
  }

  return { data: payload as T, requestId }
}
