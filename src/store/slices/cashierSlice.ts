import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { VehicleEntry, VehicleExit, ChargeCalculation, Receipt, CashierSession } from "../../types/cashier.types"
import { cashierService } from "../../services/cashier.service"

interface CashierState {
  currentSession: CashierSession | null
  activeEntries: VehicleEntry[]
  currentTransaction: {
    entry: VehicleEntry | null
    charges: ChargeCalculation | null
    exit: VehicleExit | null
    receipt: Receipt | null
  }
  isLoading: boolean
  error: string | null
  lastDetectedPlate: string | null
  quickActions: any[]
}

const initialState: CashierState = {
  currentSession: null,
  activeEntries: [],
  currentTransaction: {
    entry: null,
    charges: null,
    exit: null,
    receipt: null,
  },
  isLoading: false,
  error: null,
  lastDetectedPlate: null,
  quickActions: [],
}

// Async Thunks
export const startCashierSession = createAsyncThunk(
  "cashier/startSession",
  async ({ operatorId, initialCash }: { operatorId: string; initialCash: number }) => {
    return await cashierService.startSession(operatorId, initialCash)
  },
)

export const recordVehicleEntry = createAsyncThunk("cashier/recordEntry", async (entry: Omit<VehicleEntry, "id">) => {
  return await cashierService.recordVehicleEntry(entry)
})

export const searchVehicleEntry = createAsyncThunk(
  "cashier/searchEntry",
  async ({ licensePlate, parkingId }: { licensePlate: string; parkingId: string }) => {
    return await cashierService.searchVehicleEntry(licensePlate, parkingId)
  },
)

export const calculateCharges = createAsyncThunk(
  "cashier/calculateCharges",
  async ({ entryId, exitTime }: { entryId: string; exitTime?: Date }) => {
    return await cashierService.calculateCharges(entryId, exitTime)
  },
)

export const processVehicleExit = createAsyncThunk("cashier/processExit", async (exit: Omit<VehicleExit, "id">) => {
  return await cashierService.processVehicleExit(exit)
})

export const generateReceipt = createAsyncThunk("cashier/generateReceipt", async (exitId: string) => {
  return await cashierService.generateReceipt(exitId)
})

export const detectLicensePlate = createAsyncThunk("cashier/detectPlate", async (imageData: string) => {
  return await cashierService.detectLicensePlate(imageData)
})

const cashierSlice = createSlice({
  name: "cashier",
  initialState,
  reducers: {
    clearCurrentTransaction: (state) => {
      state.currentTransaction = {
        entry: null,
        charges: null,
        exit: null,
        receipt: null,
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    updateActiveEntries: (state, action: PayloadAction<VehicleEntry[]>) => {
      state.activeEntries = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Session
      .addCase(startCashierSession.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(startCashierSession.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentSession = action.payload
      })
      .addCase(startCashierSession.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to start session"
      })

      // Record Entry
      .addCase(recordVehicleEntry.fulfilled, (state, action) => {
        state.currentTransaction.entry = action.payload
        state.activeEntries.push(action.payload)
      })

      // Search Entry
      .addCase(searchVehicleEntry.fulfilled, (state, action) => {
        state.currentTransaction.entry = action.payload
      })

      // Calculate Charges
      .addCase(calculateCharges.fulfilled, (state, action) => {
        state.currentTransaction.charges = action.payload
      })

      // Process Exit
      .addCase(processVehicleExit.fulfilled, (state, action) => {
        state.currentTransaction.exit = action.payload
        // Remove from active entries
        state.activeEntries = state.activeEntries.filter((entry) => entry.id !== action.payload.entryId)
      })

      // Generate Receipt
      .addCase(generateReceipt.fulfilled, (state, action) => {
        state.currentTransaction.receipt = action.payload
      })

      // Detect License Plate
      .addCase(detectLicensePlate.fulfilled, (state, action) => {
        state.lastDetectedPlate = action.payload
      })
  },
})

export const { clearCurrentTransaction, setError, clearError, updateActiveEntries } = cashierSlice.actions
export default cashierSlice.reducer
