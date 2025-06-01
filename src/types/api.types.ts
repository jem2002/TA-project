export interface ApiResponse<T = any> {
  status: "success" | "error"
  code: number
  data?: T
  message: string
  error?: {
    type: string
    message: string
    details?: Record<string, string>
  }
}

export interface PageResponse<T> {
  content: T[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface ApiError {
  message: string
  status: number
  type: string
  details?: Record<string, string>
}

export interface RequestConfig {
  timeout?: number
  retries?: number
  retryDelay?: number
}
