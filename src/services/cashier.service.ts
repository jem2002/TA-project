import { apiService } from "./api.service"
import type { VehicleEntry, VehicleExit, ChargeCalculation, Receipt, CashierSession } from "../types/cashier.types"

class CashierService {
  // Vehicle Entry Operations
  async recordVehicleEntry(entry: Omit<VehicleEntry, "id">): Promise<VehicleEntry> {
    return apiService.post<VehicleEntry>("/api/v1/cashier/entries", entry)
  }

  async getActiveEntries(parkingId: string): Promise<VehicleEntry[]> {
    return apiService.get<VehicleEntry[]>(`/api/v1/cashier/entries/active?parkingId=${parkingId}`)
  }

  async searchVehicleEntry(licensePlate: string, parkingId: string): Promise<VehicleEntry | null> {
    return apiService.get<VehicleEntry>(
      `/api/v1/cashier/entries/search?licensePlate=${licensePlate}&parkingId=${parkingId}`,
    )
  }

  // License Plate Detection
  async detectLicensePlate(imageData: string): Promise<string> {
    return apiService
      .post<{ licensePlate: string }>("/api/v1/cashier/detect-plate", { imageData })
      .then((response) => response.licensePlate)
  }

  // Charge Calculation
  async calculateCharges(entryId: string, exitTime?: Date): Promise<ChargeCalculation> {
    const params = exitTime ? `?exitTime=${exitTime.toISOString()}` : ""
    return apiService.get<ChargeCalculation>(`/api/v1/cashier/calculate-charges/${entryId}${params}`)
  }

  // Vehicle Exit Operations
  async processVehicleExit(exit: Omit<VehicleExit, "id">): Promise<VehicleExit> {
    return apiService.post<VehicleExit>("/api/v1/cashier/exits", exit)
  }

  // Receipt Operations
  async generateReceipt(exitId: string): Promise<Receipt> {
    return apiService.get<Receipt>(`/api/v1/cashier/receipts/${exitId}`)
  }

  async printReceipt(receiptId: string): Promise<void> {
    return apiService.post<void>(`/api/v1/cashier/receipts/${receiptId}/print`)
  }

  async emailReceipt(receiptId: string, email: string): Promise<void> {
    return apiService.post<void>(`/api/v1/cashier/receipts/${receiptId}/email`, { email })
  }

  // Session Management
  async startSession(operatorId: string, initialCash: number): Promise<CashierSession> {
    return apiService.post<CashierSession>("/api/v1/cashier/sessions/start", { operatorId, initialCash })
  }

  async endSession(sessionId: string, finalCash: number): Promise<CashierSession> {
    return apiService.post<CashierSession>(`/api/v1/cashier/sessions/${sessionId}/end`, { finalCash })
  }

  async getCurrentSession(): Promise<CashierSession | null> {
    return apiService.get<CashierSession>("/api/v1/cashier/sessions/current")
  }

  // Real-time Updates
  async getRealtimeUpdates(parkingId: string): Promise<EventSource> {
    return new EventSource(`${process.env.REACT_APP_API_BASE_URL}/api/v1/cashier/updates?parkingId=${parkingId}`)
  }
}

export const cashierService = new CashierService()
