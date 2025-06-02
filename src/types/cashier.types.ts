export interface VehicleEntry {
  id?: string
  licensePlate: string
  vehicleType: string
  entryTime: Date
  parkingId: string
  parkingSpaceId?: string
  operatorId: string
  isManualEntry: boolean
  notes?: string
}

export interface VehicleExit {
  id?: string
  entryId: string
  licensePlate: string
  exitTime: Date
  totalAmount: number
  discountAmount?: number
  finalAmount: number
  paymentMethod: "CASH" | "CARD" | "DIGITAL"
  operatorId: string
  receiptNumber: string
  notes?: string
}

export interface ChargeCalculation {
  entryTime: Date
  exitTime: Date
  duration: number // in minutes
  baseRate: number
  additionalCharges: number
  discounts: number
  totalAmount: number
  breakdown: ChargeBreakdown[]
}

export interface ChargeBreakdown {
  description: string
  amount: number
  type: "BASE" | "ADDITIONAL" | "DISCOUNT"
}

export interface Receipt {
  receiptNumber: string
  licensePlate: string
  entryTime: Date
  exitTime: Date
  duration: string
  charges: ChargeBreakdown[]
  totalAmount: number
  paymentMethod: string
  operatorName: string
  parkingName: string
  timestamp: Date
}

export interface CashierSession {
  id: string
  operatorId: string
  operatorName: string
  startTime: Date
  endTime?: Date
  totalTransactions: number
  totalAmount: number
  cashOnHand: number
}

export interface QuickAction {
  id: string
  label: string
  action: () => void
  icon: string
  color: string
}
