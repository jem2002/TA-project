"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store"
import { LoginPage } from "./pages/auth/LoginPage"
import { RegisterPage } from "./pages/auth/RegisterPage"
import { DashboardPage } from "./pages/DashboardPage"
import { CashierDashboard } from "./pages/cashier/CashierDashboard"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { PublicRoute } from "./components/auth/PublicRoute"
import { UnauthorizedPage } from "./pages/UnauthorizedPage"
import { LoadingSpinner } from "./components/ui/LoadingSpinner"
import { useAuth } from "./hooks/useAuth"
import { CustomerDashboard } from "./pages/customer/CustomerDashboard"
import { ReservationManagement } from "./pages/customer/ReservationManagement"
import { LoyaltyRewards } from "./pages/customer/LoyaltyRewards"

const AppContent: React.FC = () => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
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
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cashier"
        element={
          <ProtectedRoute allowedRoles={["CASHIER", "MANAGER", "ADMIN"]}>
            <CashierDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["CLIENT", "CUSTOMER"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/reservations"
        element={
          <ProtectedRoute allowedRoles={["CLIENT", "CUSTOMER"]}>
            <ReservationManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/loyalty"
        element={
          <ProtectedRoute allowedRoles={["CLIENT", "CUSTOMER"]}>
            <LoyaltyRewards />
          </ProtectedRoute>
        }
      />

      {/* Error Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </Provider>
  )
}

export default App
