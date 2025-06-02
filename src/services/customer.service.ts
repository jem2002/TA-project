import { apiService } from "./api.service"
import type {
  ParkingAvailability,
  Reservation,
  ReservationRequest,
  LoyaltyAccount,
  LoyaltyTransaction,
  Reward,
  PaymentMethod,
  CustomerFilters,
} from "@/types/customer.types"
import type { ApiResponse, PageResponse } from "@/types/api.types"

class CustomerService {
  // Parking Availability
  async getParkingAvailability(filters?: CustomerFilters): Promise<ParkingAvailability[]> {
    const params = new URLSearchParams()

    if (filters?.location) {
      params.append("lat", filters.location.lat.toString())
      params.append("lng", filters.location.lng.toString())
      params.append("radius", filters.location.radius.toString())
    }

    if (filters?.vehicleType) params.append("vehicleType", filters.vehicleType)
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
    if (filters?.availableNow) params.append("availableNow", "true")
    if (filters?.electricCharging) params.append("electricCharging", "true")
    if (filters?.accessible) params.append("accessible", "true")

    if (filters?.amenities?.length) {
      filters.amenities.forEach((amenity) => params.append("amenities", amenity))
    }

    const response: ApiResponse<ParkingAvailability[]> = await apiService.get(
      `/customer/parking/availability?${params.toString()}`,
    )

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to fetch parking availability")
  }

  async getParkingDetails(parkingId: string): Promise<ParkingAvailability> {
    const response: ApiResponse<ParkingAvailability> = await apiService.get(`/customer/parking/${parkingId}/details`)

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to fetch parking details")
  }

  // Reservations
  async createReservation(reservationData: ReservationRequest): Promise<Reservation> {
    const response: ApiResponse<Reservation> = await apiService.post("/customer/reservations", reservationData)

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to create reservation")
  }

  async getReservations(page = 0, limit = 10): Promise<PageResponse<Reservation>> {
    const response: ApiResponse<PageResponse<Reservation>> = await apiService.get(
      `/customer/reservations?page=${page}&limit=${limit}`,
    )

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to fetch reservations")
  }

  async getReservation(reservationId: string): Promise<Reservation> {
    const response: ApiResponse<Reservation> = await apiService.get(`/customer/reservations/${reservationId}`)

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to fetch reservation")
  }

  async cancelReservation(reservationId: string): Promise<void> {
    const response: ApiResponse<void> = await apiService.delete(`/customer/reservations/${reservationId}`)

    if (response.status !== "success") {
      throw new Error(response.error?.message || "Failed to cancel reservation")
    }
  }

  async extendReservation(reservationId: string, newEndTime: Date): Promise<Reservation> {
    const response: ApiResponse<Reservation> = await apiService.put(`/customer/reservations/${reservationId}/extend`, {
      newEndTime,
    })

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to extend reservation")
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response: ApiResponse<PaymentMethod[]> = await apiService.get("/customer/payment-methods")

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to fetch payment methods")
  }

  async addPaymentMethod(paymentData: Omit<PaymentMethod, "id">): Promise<PaymentMethod> {
    const response: ApiResponse<PaymentMethod> = await apiService.post("/customer/payment-methods", paymentData)

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to add payment method")
  }

  // Loyalty System
  async getLoyaltyAccount(): Promise<LoyaltyAccount> {
    const response: ApiResponse<LoyaltyAccount> = await apiService.get("/customer/loyalty/account")

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to fetch loyalty account")
  }

  async getLoyaltyTransactions(page = 0, limit = 20): Promise<PageResponse<LoyaltyTransaction>> {
    const response: ApiResponse<PageResponse<LoyaltyTransaction>> = await apiService.get(
      `/customer/loyalty/transactions?page=${page}&limit=${limit}`,
    )

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to fetch loyalty transactions")
  }

  async getAvailableRewards(): Promise<Reward[]> {
    const response: ApiResponse<Reward[]> = await apiService.get("/customer/loyalty/rewards")

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to fetch available rewards")
  }

  async redeemReward(rewardId: string): Promise<void> {
    const response: ApiResponse<void> = await apiService.post(`/customer/loyalty/rewards/${rewardId}/redeem`)

    if (response.status !== "success") {
      throw new Error(response.error?.message || "Failed to redeem reward")
    }
  }

  // Utility methods
  async calculateReservationCost(reservationData: ReservationRequest): Promise<{
    baseAmount: number
    discounts: number
    taxes: number
    totalAmount: number
    loyaltyPointsEarned: number
  }> {
    const response = await apiService.post("/customer/reservations/calculate-cost", reservationData)

    if (response.status === "success" && response.data) {
      return response.data
    }

    throw new Error(response.error?.message || "Failed to calculate reservation cost")
  }
}

export const customerService = new CustomerService()
export default customerService
