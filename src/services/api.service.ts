import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import type { ApiResponse, ApiError, RequestConfig } from "@/types/api.types"
import type { AuthTokens } from "@/types/auth.types"

class ApiService {
  private api: AxiosInstance
  private baseURL: string
  private defaultTimeout = 10000

  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api"

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: this.defaultTimeout,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const tokens = this.getStoredTokens()
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor for error handling and token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const tokens = this.getStoredTokens()
            if (tokens?.refreshToken) {
              const newTokens = await this.refreshToken(tokens.refreshToken)
              this.setAuthTokens(newTokens)
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
              return this.api(originalRequest)
            }
          } catch (refreshError) {
            this.clearAuthTokens()
            window.location.href = "/login"
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(this.handleApiError(error))
      },
    )
  }

  private handleApiError(error: any): ApiError {
    if (error.response) {
      const { data, status } = error.response
      return {
        message: data?.error?.message || data?.message || "An error occurred",
        status,
        type: data?.error?.type || "UnknownError",
        details: data?.error?.details,
      }
    } else if (error.request) {
      return {
        message: "Network error - please check your connection",
        status: 0,
        type: "NetworkError",
      }
    } else {
      return {
        message: error.message || "An unexpected error occurred",
        status: 0,
        type: "UnknownError",
      }
    }
  }

  private getStoredTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem("auth_tokens")
      return tokens ? JSON.parse(tokens) : null
    } catch {
      return null
    }
  }

  private setAuthTokens(tokens: AuthTokens): void {
    localStorage.setItem("auth_tokens", JSON.stringify(tokens))
  }

  private clearAuthTokens(): void {
    localStorage.removeItem("auth_tokens")
  }

  private async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await axios.post(`${this.baseURL}/auth/token/refresh`, {
      refreshToken,
    })
    return response.data.data.tokens
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig & RequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig & RequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig & RequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig & RequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url, config)
    return response.data
  }

  // Utility methods
  setAuthToken(tokens: AuthTokens): void {
    this.setAuthTokens(tokens)
  }

  clearAuth(): void {
    this.clearAuthTokens()
  }

  getBaseURL(): string {
    return this.baseURL
  }
}

export const apiService = new ApiService()
export default apiService
