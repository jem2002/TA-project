import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type {
  ParkingAvailability,
  Reservation,
  LoyaltyAccount,
  LoyaltyTransaction,
  Reward,
  PaymentMethod,
  CustomerFilters,
} from "@/types/customer.types"
import { customerService } from "@/services/customer.service"
import type { ApiError } from "@/types/api.types"

interface CustomerState {
  // Parking availability
  parkingAvailability: ParkingAvailability[]
  selectedParking: ParkingAvailability | null
  filters: CustomerFilters
  isLoadingAvailability: boolean

  // Reservations
  reservations: Reservation[]
  currentReservation: Reservation | null
  isLoadingReservations: boolean

  // Loyalty
  loyaltyAccount: LoyaltyAccount | null
  loyaltyTransactions: LoyaltyTransaction[]
  availableRewards: Reward[]
  isLoadingLoyalty: boolean

  // Payment
  paymentMethods: PaymentMethod[]
  isLoadingPayment: boolean

  // UI state
  error: string | null
  successMessage: string | null
}

const initialState: CustomerState = {
  parkingAvailability: [],
  selectedParking: null,
  filters: {},
  isLoadingAvailability: false,
  reservations: [],
  currentReservation: null,
  isLoadingReservations: false,
  loyaltyAccount: null,
  loyaltyTransactions: [],
  availableRewards: [],
  isLoadingLoyalty: false,
  paymentMethods: [],
  isLoadingPayment: false,
  error: null,
  successMessage: null,
}

// Async thunks
export const fetchParkingAvailability = createAsyncThunk<
  ParkingAvailability[],
  CustomerFilters | undefined,
  { rejectValue: string }
>("customer/fetchParkingAvailability", async (filters, { rejectWithValue }) => {
  try {
    return await customerService.getParkingAvailability(filters)
  } catch (error) {
    const apiError = error as ApiError
    return rejectWithValue(apiError.message || "Failed to fetch parking availability")
  }
})

export const fetchReservations = createAsyncThunk<
  Reservation[],
  { page?: number; limit?: number },
  { rejectValue: string }
>("customer/fetchReservations", async ({ page = 0, limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await customerService.getReservations(page, limit)
    return response.content
  } catch (error) {
    const apiError = error as ApiError
    return rejectWithValue(apiError.message || "Failed to fetch reservations")
  }
})

export const createReservation = createAsyncThunk<Reservation, any, { rejectValue: string }>(
  "customer/createReservation",
  async (reservationData, { rejectWithValue }) => {
    try {
      return await customerService.createReservation(reservationData)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message || "Failed to create reservation")
    }
  },
)

export const fetchLoyaltyAccount = createAsyncThunk<LoyaltyAccount, void, { rejectValue: string }>(
  "customer/fetchLoyaltyAccount",
  async (_, { rejectWithValue }) => {
    try {
      return await customerService.getLoyaltyAccount()
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message || "Failed to fetch loyalty account")
    }
  },
)

export const fetchAvailableRewards = createAsyncThunk<Reward[], void, { rejectValue: string }>(
  "customer/fetchAvailableRewards",
  async (_, { rejectWithValue }) => {
    try {
      return await customerService.getAvailableRewards()
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message || "Failed to fetch available rewards")
    }
  },
)

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<CustomerFilters>) => {
      state.filters = action.payload
    },
    setSelectedParking: (state, action: PayloadAction<ParkingAvailability | null>) => {
      state.selectedParking = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    },
    setSuccessMessage: (state, action: PayloadAction<string>) => {
      state.successMessage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Parking availability
      .addCase(fetchParkingAvailability.pending, (state) => {
        state.isLoadingAvailability = true
        state.error = null
      })
      .addCase(fetchParkingAvailability.fulfilled, (state, action) => {
        state.isLoadingAvailability = false
        state.parkingAvailability = action.payload
      })
      .addCase(fetchParkingAvailability.rejected, (state, action) => {
        state.isLoadingAvailability = false
        state.error = action.payload || "Failed to fetch parking availability"
      })

      // Reservations
      .addCase(fetchReservations.pending, (state) => {
        state.isLoadingReservations = true
        state.error = null
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.isLoadingReservations = false
        state.reservations = action.payload
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.isLoadingReservations = false
        state.error = action.payload || "Failed to fetch reservations"
      })

      .addCase(createReservation.pending, (state) => {
        state.isLoadingReservations = true
        state.error = null
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.isLoadingReservations = false
        state.currentReservation = action.payload
        state.reservations.unshift(action.payload)
        state.successMessage = "Reservation created successfully!"
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.isLoadingReservations = false
        state.error = action.payload || "Failed to create reservation"
      })

      // Loyalty
      .addCase(fetchLoyaltyAccount.pending, (state) => {
        state.isLoadingLoyalty = true
        state.error = null
      })
      .addCase(fetchLoyaltyAccount.fulfilled, (state, action) => {
        state.isLoadingLoyalty = false
        state.loyaltyAccount = action.payload
      })
      .addCase(fetchLoyaltyAccount.rejected, (state, action) => {
        state.isLoadingLoyalty = false
        state.error = action.payload || "Failed to fetch loyalty account"
      })

      .addCase(fetchAvailableRewards.fulfilled, (state, action) => {
        state.availableRewards = action.payload
      })
  },
})

export const { setFilters, setSelectedParking, clearError, clearSuccessMessage, setSuccessMessage } =
  customerSlice.actions

export default customerSlice.reducer
