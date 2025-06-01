import { apiService } from "./api.service"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  User,
} from "@/types/auth.types"
import type { ApiResponse } from "@/types/api.types"

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: ApiResponse<LoginResponse> = await apiService.post("/auth/login", credentials)

    if (response.status === "success" && response.data) {
      // Store tokens in the API service
      apiService.setAuthToken(response.data.tokens)
      return response.data
    }

    throw new Error(response.error?.message || "Login failed")
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response: ApiResponse<{ user: User }> = await apiService.post("/auth/register", userData)

    if (response.status === "success" && response.data) {
      return response.data.user
    }

    throw new Error(response.error?.message || "Registration failed")
  }

  async logout(): Promise<void> {
    try {
      // Get refresh token from storage
      const tokens = this.getStoredTokens()
      if (tokens?.refreshToken) {
        await apiService.post("/auth/logout", {
          refreshToken: tokens.refreshToken,
        })
      }
    } catch (error) {
      console.warn("Logout request failed:", error)
    } finally {
      // Always clear local storage
      apiService.clearAuth()
    }
  }

  async requestPasswordReset(email: PasswordResetRequest): Promise<void> {
    const response: ApiResponse<void> = await apiService.post("/auth/password/reset-request", email)

    if (response.status !== "success") {
      throw new Error(response.error?.message || "Password reset request failed")
    }
  }

  async confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<void> {
    const response: ApiResponse<void> = await apiService.post("/auth/password/reset-confirm", data)

    if (response.status !== "success") {
      throw new Error(response.error?.message || "Password reset failed")
    }
  }

  async getCurrentUser(): Promise<User> {
    const response: ApiResponse<User> = await apiService.get("/users/me")

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to get current user")
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response: ApiResponse<LoginResponse> = await apiService.post("/auth/token/refresh", { refreshToken })

    if (response.status === "success" && response.data) {
      apiService.setAuthToken(response.data.tokens)
      return response.data
    }

    throw new Error(response.error?.message || "Token refresh failed")
  }

  private getStoredTokens() {
    try {
      const tokens = localStorage.getItem("auth_tokens")
      return tokens ? JSON.parse(tokens) : null
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens()
    return !!tokens?.accessToken
  }

  getAccessToken(): string | null {
    const tokens = this.getStoredTokens()
    return tokens?.accessToken || null
  }
}

export const authService = new AuthService()
export default authService
