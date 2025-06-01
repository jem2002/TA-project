import type React from "react"
import type { UserRole } from "./user.types" // Assuming UserRole is declared in another file

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface FormFieldError {
  field: string
  message: string
}

export interface ValidationErrors {
  [key: string]: string
}

export interface RouteConfig {
  path: string
  component: React.ComponentType
  protected: boolean
  roles?: UserRole[]
  exact?: boolean
}

export interface NavigationItem {
  label: string
  path: string
  icon?: string
  roles?: UserRole[]
  children?: NavigationItem[]
}
