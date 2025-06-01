"use client"

import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface PublicRouteProps {
  children: React.ReactNode
  redirectPath?: string
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectPath = "/dashboard" }) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}

export default PublicRoute
