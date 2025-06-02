export interface ParkingAvailability {
  parkingId: string
  parkingName: string
  address: string
  totalSpaces: number
  availableSpaces: number
  occupiedSpaces: number
  reservedSpaces: number
  coordinates: {
    lat: number
    lng: number
  }
  zones: ParkingZoneAvailability[]
  amenities: string[]
  hourlyRate: number
  dailyRate: number
  distance?: number
}

export interface ParkingZoneAvailability {
  zoneId: string
  zoneName: string
  floor: number
  totalSpaces: number
  availableSpaces: number
  spaces: ParkingSpaceInfo[]
  vehicleTypes: string[]
}

export interface ParkingSpaceInfo {
  spaceId: string
  spaceNumber: string
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE"
  vehicleType: string
  isAccessible: boolean
  isElectric: boolean
  hourlyRate: number
}

export interface ReservationRequest {
  parkingId: string
  spaceId?: string
  vehicleType: string
  startDateTime: Date
  endDateTime: Date
  vehicleLicensePlate: string
  specialRequests?: string
  paymentMethodId?: string
}

export interface Reservation {
  id: string
  reservationNumber: string
  parkingId: string
  parkingName: string
  parkingAddress: string
  spaceId?: string
  spaceNumber?: string
  vehicleType: string
  vehicleLicensePlate: string
  startDateTime: Date
  endDateTime: Date
  status: "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  totalAmount: number
  paidAmount: number
  paymentStatus: "PENDING" | "PAID" | "REFUNDED" | "FAILED"
  loyaltyPointsEarned: number
  loyaltyPointsUsed: number
  specialRequests?: string
  qrCode?: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentMethod {
  id: string
  type: "CREDIT_CARD" | "DEBIT_CARD" | "DIGITAL_WALLET" | "LOYALTY_POINTS"
  lastFourDigits?: string
  expiryDate?: string
  isDefault: boolean
  provider?: string
}

export interface LoyaltyAccount {
  userId: string
  currentPoints: number
  totalEarned: number
  totalRedeemed: number
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
  nextTierPoints: number
  pointsToNextTier: number
  memberSince: Date
}

export interface LoyaltyTransaction {
  id: string
  type: "EARNED" | "REDEEMED" | "EXPIRED"
  points: number
  description: string
  reservationId?: string
  createdAt: Date
  expiresAt?: Date
}

export interface Reward {
  id: string
  title: string
  description: string
  pointsCost: number
  type: "DISCOUNT" | "FREE_PARKING" | "UPGRADE" | "MERCHANDISE"
  value: number
  validUntil: Date
  isAvailable: boolean
  termsAndConditions: string
}

export interface CustomerFilters {
  location?: {
    lat: number
    lng: number
    radius: number
  }
  vehicleType?: string
  amenities?: string[]
  maxPrice?: number
  availableNow?: boolean
  electricCharging?: boolean
  accessible?: boolean
}
