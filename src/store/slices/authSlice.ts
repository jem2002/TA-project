import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthState, LoginRequest, RegisterRequest, User, LoginResponse } from "@/types/auth.types"
import { authService } from "@/services/auth.service"
import type { ApiError } from "@/types/api.types"

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message || "Login failed")
    }
  },
)

export const registerUser = createAsyncThunk<User, RegisterRequest, { rejectValue: string }>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.register(userData)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message || "Registration failed")
    }
  },
)

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message || "Logout failed")
    }
  },
)

export const getCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser()
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message || "Failed to get current user")
    }
  },
)

export const refreshUserToken = createAsyncThunk<LoginResponse, string, { rejectValue: string }>(
  "auth/refreshToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      return await authService.refreshToken(refreshToken)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message || "Token refresh failed")
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.tokens = action.payload.tokens
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Login failed"
        state.isAuthenticated = false
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Registration failed"
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        return initialState
      })
      .addCase(logoutUser.rejected, (state) => {
        return initialState
      })

      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Failed to get current user"
        state.isAuthenticated = false
      })

      // Refresh token
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.tokens = action.payload.tokens
        state.isAuthenticated = true
      })
      .addCase(refreshUserToken.rejected, (state) => {
        return initialState
      })
  },
})

export const { clearError, setLoading, resetAuthState } = authSlice.actions
export default authSlice.reducer
