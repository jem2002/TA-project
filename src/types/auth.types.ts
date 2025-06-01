export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  companyId?: string
  companyName?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export enum UserRole {
  GENERAL_ADMIN = "GENERAL_ADMIN",
  COMPANY_ADMIN = "COMPANY_ADMIN",
  SUPERVISOR = "SUPERVISOR",
  OPERATOR = "OPERATOR",
  CLIENT = "CLIENT",
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  companyId?: string
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  token: string
  newPassword: string
}
