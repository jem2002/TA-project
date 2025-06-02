"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Button from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"
import { FinancialSummaryCard } from "@/components/reports/FinancialSummaryCard"
import { OccupancySummaryCard } from "@/components/reports/OccupancySummaryCard"
import { AlertsPanel } from "@/components/alerts/AlertsPanel"
import { RecentReportsTable } from "@/components/reports/RecentReportsTable"
import { QuickActionsPanel } from "@/components/admin/QuickActionsPanel"
import { MetricsOverview } from "@/components/admin/MetricsOverview"
import type { DashboardMetrics } from "@/types/reports.types"
import reportsService from "@/services/reports.service"

const AdminDashboard: React.FC = () => {
  const { user, isCompanyAdmin, isAdmin } = useAuth()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedParkingId, setSelectedParkingId] = useState<string | undefined>()

  useEffect(() => {
    loadDashboardData()
  }, [selectedParkingId])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load dashboard metrics
      const [financialSummary, occupancySummary, activeAlerts] = await Promise.all([
        reportsService.getDashboardFinancialSummary(user?.companyId, selectedParkingId),
        reportsService.getDashboardOccupancySummary(user?.companyId, selectedParkingId),
        reportsService.getActiveAlerts(),
      ])

      const dashboardMetrics: DashboardMetrics = {
        totalRevenue: financialSummary.totalRevenue,
        totalSessions: financialSummary.totalSessions,
        averageOccupancy: occupancySummary.averageOccupancyRate,
        activeAlerts: activeAlerts.length,
        revenueGrowth: financialSummary.growthRate,
        occupancyTrend: 0, // Calculate trend
        pendingPayments: activeAlerts.filter((a) => a.alertType === "PENDING_PAYMENT").length,
        lowAvailabilityCount: activeAlerts.filter((a) => a.alertType === "LOW_AVAILABILITY").length,
      }

      setMetrics(dashboardMetrics)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{isAdmin ? "System Dashboard" : "Company Dashboard"}</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}! Here's your parking management overview.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={loadDashboardData}>
                Refresh Data
              </Button>
              <Button variant="primary">Generate Report</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-responsive py-8">
        {/* Metrics Overview */}
        {metrics && <MetricsOverview metrics={metrics} />}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Financial & Occupancy */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Summary */}
            <FinancialSummaryCard companyId={user?.companyId} parkingId={selectedParkingId} />

            {/* Occupancy Summary */}
            <OccupancySummaryCard companyId={user?.companyId} parkingId={selectedParkingId} />

            {/* Recent Reports */}
            <RecentReportsTable companyId={user?.companyId} parkingId={selectedParkingId} />
          </div>

          {/* Right Column - Alerts & Quick Actions */}
          <div className="space-y-6">
            {/* Alerts Panel */}
            <AlertsPanel />

            {/* Quick Actions */}
            <QuickActionsPanel userRole={user?.role} companyId={user?.companyId} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
