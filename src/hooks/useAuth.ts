"use client"

import { useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./redux.hooks"
import { loginUser, logoutUser, registerUser, getCurrentUser, clearError } from "@/store/slices/authSlice"
import type { LoginRequest, RegisterRequest } from "@/types/auth.types"

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, tokens, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth)

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(loginUser(credentials))
      return result.type === "auth/login/fulfilled"
    },
    [dispatch],
  )

  const register = useCallback(
    async (userData: RegisterRequest) => {
      const result = await dispatch(registerUser(userData))
      return result.type === "auth/register/fulfilled"
    },
    [dispatch],
  )

  const logout = useCallback(async () => {
    await dispatch(logoutUser())
  }, [dispatch])

  const fetchCurrentUser = useCallback(async () => {
    if (isAuthenticated && !user) {
      await dispatch(getCurrentUser())
    }
  }, [dispatch, isAuthenticated, user])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Auto-fetch user data on mount if authenticated but no user data
  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  return {
    // State
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    clearAuthError,

    // Computed values
    userRole: user?.role,
    userCompany: user?.companyId,
    isAdmin: user?.role === "GENERAL_ADMIN",
    isCompanyAdmin: user?.role === "COMPANY_ADMIN",
  }
}
