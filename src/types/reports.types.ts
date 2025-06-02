export interface FinancialReport {
  id: string
  parkingName: string
  companyName: string
  reportPeriod: ReportPeriod
  periodStart: string
  periodEnd: string
  totalRevenue: number
  totalSessions: number
  totalReservations: number
  averageSessionDurationMinutes: number
  peakHourRevenue: number
  offPeakRevenue: number
  loyaltyPointsAwarded: number
  loyaltyPointsRedeemed: number
  discountAmount: number
  status: ReportStatus
  generatedAt: string
  filePath?: string
  averageRevenuePerSession: number
  averageRevenuePerReservation: number
  growthRate: number
  dailyBreakdown: DailyRevenueData[]
  hourlyBreakdown: HourlyRevenueData[]
}

export interface OccupancyReport {
  id: string
  parkingName: string
  companyName: string
  reportPeriod: ReportPeriod
  periodStart: string
  periodEnd: string
  totalSpaces: number
  averageOccupancyRate: number
  peakOccupancyRate: number
  peakOccupancyTime: string
  lowestOccupancyRate: number
  lowestOccupancyTime: string
  totalHoursOccupied: number
  turnoverRate: number
  status: ReportStatus
  generatedAt: string
  filePath?: string
  utilizationEfficiency: number
  dailyBreakdown: DailyOccupancyData[]
  hourlyBreakdown: HourlyOccupancyData[]
  zoneBreakdown: ZoneOccupancyData[]
}

export interface DailyRevenueData {
  date: string
  revenue: number
  sessions: number
  occupancyRate: number
}

export interface HourlyRevenueData {
  hour: number
  revenue: number
  sessions: number
  averageOccupancy: number
}

export interface DailyOccupancyData {
  date: string
  averageOccupancy: number
  peakOccupancy: number
  totalSessions: number
}

export interface HourlyOccupancyData {
  hour: number
  averageOccupancy: number
  activeSessions: number
}

export interface ZoneOccupancyData {
  zoneName: string
  averageOccupancy: number
  totalSpaces: number
  utilizationRate: number
}

export interface GenerateReportRequest {
  reportPeriod: ReportPeriod
  startDate: string
  endDate: string
  parkingIds?: string[]
  format?: "JSON" | "CSV" | "PDF"
  includeCharts?: boolean
  emailReport?: boolean
  emailRecipients?: string[]
}

export interface SystemAlert {
  id: string
  alertType: AlertType
  priority: AlertPriority
  title: string
  message: string
  parkingName?: string
  companyName?: string
  status: AlertStatus
  triggeredAt: string
  acknowledgedAt?: string
  acknowledgedByName?: string
  resolvedAt?: string
  resolvedByName?: string
  metadata?: string
  emailSent: boolean
  emailSentAt?: string
}

export type ReportPeriod = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY"
export type ReportStatus = "PENDING" | "GENERATING" | "COMPLETED" | "FAILED" | "ARCHIVED"
export type AlertType =
  | "LOW_AVAILABILITY"
  | "PENDING_PAYMENT"
  | "SYSTEM_ERROR"
  | "MAINTENANCE_REQUIRED"
  | "SECURITY_BREACH"
  | "REVENUE_THRESHOLD"
  | "OCCUPANCY_THRESHOLD"
  | "EQUIPMENT_FAILURE"
  | "USER_ACTIVITY"
  | "RESERVATION_EXPIRED"
export type AlertPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
export type AlertStatus = "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED"

export interface DashboardMetrics {
  totalRevenue: number
  totalSessions: number
  averageOccupancy: number
  activeAlerts: number
  revenueGrowth: number
  occupancyTrend: number
  pendingPayments: number
  lowAvailabilityCount: number
}

export interface ChartDataPoint {
  label: string
  value: number
  date?: string
  hour?: number
}

export interface ReportFilters {
  companyId?: string
  parkingId?: string
  startDate?: string
  endDate?: string
  reportType?: "financial" | "occupancy"
  status?: ReportStatus
}
