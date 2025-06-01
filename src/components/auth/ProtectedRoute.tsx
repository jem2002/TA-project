"use client"

import type React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import type { UserRole } from "@/types/auth.types"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  fallbackPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [], fallbackPath = "/login" }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check role-based access if roles are specified
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role)
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
