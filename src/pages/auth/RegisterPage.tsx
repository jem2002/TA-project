"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useForm } from "@/hooks/useForm"
import { type RegisterRequest, UserRole } from "@/types/auth.types"
import { validateEmail, validateRequired, validatePassword } from "@/utils/validation"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Alert from "@/components/ui/Alert"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string
  agreeToTerms: boolean
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading, error, isAuthenticated, clearAuthError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldError } =
    useForm<RegisterFormData>({
      initialValues: {
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: UserRole.CLIENT,
        agreeToTerms: false,
      },
      validate: (values) => {
        const errors: Record<string, string> = {}

        if (!validateRequired(values.firstName)) {
          errors.firstName = "First name is required"
        }

        if (!validateRequired(values.lastName)) {
          errors.lastName = "Last name is required"
        }

        if (!validateRequired(values.email)) {
          errors.email = "Email is required"
        } else if (!validateEmail(values.email)) {
          errors.email = "Please enter a valid email address"
        }

        if (!validateRequired(values.password)) {
          errors.password = "Password is required"
        } else if (!validatePassword(values.password)) {
          errors.password =
            "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
        }

        if (!validateRequired(values.confirmPassword)) {
          errors.confirmPassword = "Please confirm your password"
        } else if (values.password !== values.confirmPassword) {
          errors.confirmPassword = "Passwords do not match"
        }

        if (!values.agreeToTerms) {
          errors.agreeToTerms = "You must agree to the terms and conditions"
        }

        return errors
      },
      onSubmit: async (values) => {
        const { confirmPassword, agreeToTerms, ...registerData } = values
        const success = await register(registerData)
        if (success) {
          setRegistrationSuccess(true)
          setTimeout(() => {
            navigate("/login", {
              state: { message: "Registration successful! Please sign in." },
            })
          }, 2000)
        }
      },
    })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Clear errors when component mounts
  useEffect(() => {
    clearAuthError()
  }, [clearAuthError])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="auth-card">
          <CardContent className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-gray-600 mb-4">Your account has been created successfully. Redirecting to login...</p>
            <div className="w-6 h-6 loading-spinner mx-auto" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parking Management</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Create your account</h2>
        </div>

        <Card className="auth-card">
          <CardHeader>
            <h3 className="text-lg font-medium text-center text-gray-900">Get started today</h3>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="error" className="mb-4" onClose={clearAuthError}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.firstName}
                  placeholder="John"
                  autoComplete="given-name"
                />

                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.lastName}
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                placeholder="john.doe@example.com"
                autoComplete="email"
                leftIcon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                }
              />

              <Input
                label="Phone Number (Optional)"
                type="tel"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
                leftIcon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
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
                placeholder="Create a strong password"
                autoComplete="new-password"
                helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
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

              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                autoComplete="new-password"
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
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? (
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

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={values.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="text-gray-700">
                    I agree to the{" "}
                    <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agreeToTerms && <p className="form-error mt-1">{errors.agreeToTerms}</p>}
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
                Create Account
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                  Sign in instead
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

export default RegisterPage
