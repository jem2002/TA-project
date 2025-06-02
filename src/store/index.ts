import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../src/slices/authSlice"
import cashierReducer from "./slices/cashierSlice"
import customerReducer from "./slices/customerSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cashier: cashierReducer,
    customer: customerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
