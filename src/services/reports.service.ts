import apiService from "./api.service"
import type {
  FinancialReport,
  OccupancyReport,
  GenerateReportRequest,
  SystemAlert,
  ReportFilters,
} from "@/types/reports.types"
import type { PageResponse } from "@/types/api.types"

class ReportsService {
  // Financial Reports
  async generateFinancialReport(request: GenerateReportRequest): Promise<FinancialReport> {
    const response = await apiService.post<FinancialReport>("/reports/financial/generate", request)
    return response.data!
  }

  async getFinancialReports(filters: ReportFilters, page = 0, size = 10): Promise<PageResponse<FinancialReport>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
    })

    const response = await apiService.get<PageResponse<FinancialReport>>(`/reports/financial?${params}`)
    return response.data!
  }

  async getFinancialReport(reportId: string): Promise<FinancialReport> {
    const response = await apiService.get<FinancialReport>(`/reports/financial/${reportId}`)
    return response.data!
  }

  async exportFinancialReport(reportId: string, format: "CSV" | "PDF" | "EXCEL" = "CSV"): Promise<Blob> {
    const response = await fetch(`${apiService.getBaseURL()}/reports/financial/${reportId}/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to export report")
    }

    return response.blob()
  }

  // Occupancy Reports
  async generateOccupancyReport(request: GenerateReportRequest): Promise<OccupancyReport> {
    const response = await apiService.post<OccupancyReport>("/reports/occupancy/generate", request)
    return response.data!
  }

  async getOccupancyReports(filters: ReportFilters, page = 0, size = 10): Promise<PageResponse<OccupancyReport>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
    })

    const response = await apiService.get<PageResponse<OccupancyReport>>(`/reports/occupancy?${params}`)
    return response.data!
  }

  async getOccupancyReport(reportId: string): Promise<OccupancyReport> {
    const response = await apiService.get<OccupancyReport>(`/reports/occupancy/${reportId}`)
    return response.data!
  }

  // Dashboard
  async getDashboardFinancialSummary(companyId?: string, parkingId?: string): Promise<FinancialReport> {
    const params = new URLSearchParams()
    if (companyId) params.append("companyId", companyId)
    if (parkingId) params.append("parkingId", parkingId)

    const response = await apiService.get<FinancialReport>(`/reports/dashboard/financial?${params}`)
    return response.data!
  }

  async getDashboardOccupancySummary(companyId?: string, parkingId?: string): Promise<OccupancyReport> {
    const params = new URLSearchParams()
    if (companyId) params.append("companyId", companyId)
    if (parkingId) params.append("parkingId", parkingId)

    const response = await apiService.get<OccupancyReport>(`/reports/dashboard/occupancy?${params}`)
    return response.data!
  }

  // Alerts
  async getAlerts(
    filters: {
      companyId?: string
      parkingId?: string
      status?: string
      alertType?: string
    },
    page = 0,
    size = 10,
  ): Promise<PageResponse<SystemAlert>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
    })

    const response = await apiService.get<PageResponse<SystemAlert>>(`/alerts?${params}`)
    return response.data!
  }

  async getActiveAlerts(): Promise<SystemAlert[]> {
    const response = await apiService.get<SystemAlert[]>("/alerts/active")
    return response.data!
  }

  async getUnreadAlertCount(): Promise<number> {
    const response = await apiService.get<{ count: number }>("/alerts/unread-count")
    return response.data!.count
  }

  async acknowledgeAlert(alertId: string): Promise<SystemAlert> {
    const response = await apiService.post<SystemAlert>(`/alerts/${alertId}/acknowledge`)
    return response.data!
  }

  async resolveAlert(alertId: string): Promise<SystemAlert> {
    const response = await apiService.post<SystemAlert>(`/alerts/${alertId}/resolve`)
    return response.data!
  }

  async dismissAlert(alertId: string): Promise<SystemAlert> {
    const response = await apiService.post<SystemAlert>(`/alerts/${alertId}/dismiss`)
    return response.data!
  }

  private getAuthToken(): string {
    const tokens = localStorage.getItem("auth_tokens")
    return tokens ? JSON.parse(tokens).accessToken : ""
  }
}

export const reportsService = new ReportsService()
export default reportsService
