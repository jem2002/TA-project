"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useForm } from "@/hooks/useForm"
import type { LoginRequest } from "@/types/auth.types"
import { validateEmail, validateRequired } from "@/utils/validation"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Alert from "@/components/ui/Alert"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, isAuthenticated, clearAuthError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const from = (location.state as any)?.from?.pathname || "/dashboard"

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm<LoginRequest>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {}

      if (!validateRequired(values.email)) {
        errors.email = "Email is required"
      } else if (!validateEmail(values.email)) {
        errors.email = "Please enter a valid email address"
      }

      if (!validateRequired(values.password)) {
        errors.password = "Password is required"
      }

      return errors
    },
    onSubmit: async (values) => {
      const success = await login(values)
      if (success) {
        navigate(from, { replace: true })
      }
    },
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  // Clear errors when component mounts
  useEffect(() => {
    clearAuthError()
  }, [clearAuthError])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parking Management</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Sign in to your account</h2>
        </div>

        <Card className="auth-card">
          <CardHeader>
            <h3 className="text-lg font-medium text-center text-gray-900">Welcome back</h3>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="error" className="mb-4" onClose={clearAuthError}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                placeholder="Enter your email"
                autoComplete="email"
                leftIcon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                }
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                placeholder="Enter your password"
                autoComplete="current-password"
                leftIcon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                rightIcon={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                }
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading || isSubmitting}
                disabled={isLoading || isSubmitting}
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to our platform?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                  Create an account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>© 2023 Parking Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
