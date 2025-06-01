"use client"

import type React from "react"
import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "@/store"
import { useAuth } from "@/hooks/useAuth"
import { UserRole } from "@/types/auth.types"

// Components
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import PublicRoute from "@/components/auth/PublicRoute"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

// Pages
import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "@/pages/auth/RegisterPage"
import DashboardPage from "@/pages/DashboardPage"
import UnauthorizedPage from "@/pages/UnauthorizedPage"

// App Content Component (inside Redux Provider)
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, fetchCurrentUser } = useAuth()

  // Fetch current user data on app initialization
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser()
    }
  }, [isAuthenticated, fetchCurrentUser])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRoles={[UserRole.GENERAL_ADMIN]}>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-gray-600 mt-2">Admin features coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Company Admin Routes */}
        <Route
          path="/company/*"
          element={
            <ProtectedRoute requiredRoles={[UserRole.GENERAL_ADMIN, UserRole.COMPANY_ADMIN]}>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Company Management</h1>
                <p className="text-gray-600 mt-2">Company features coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Error Pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Default Redirects */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Page not found</p>
                <a href="/" className="text-primary-600 hover:text-primary-500 font-medium">
                  Go back home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

// Main App Component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoadingSpinner size="lg" />
          </div>
        }
        persistor={persistor}
      >
        <AppContent />
      </PersistGate>
    </Provider>
  )
}

export default App
