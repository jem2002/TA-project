"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { FinancialReport, ChartDataPoint } from "@/types/reports.types"
import reportsService from "@/services/reports.service"

interface FinancialSummaryCardProps {
  companyId?: string
  parkingId?: string
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ companyId, parkingId }) => {
  const [report, setReport] = useState<FinancialReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    loadFinancialSummary()
  }, [companyId, parkingId])

  const loadFinancialSummary = async () => {
    try {
      setLoading(true)
      const summary = await reportsService.getDashboardFinancialSummary(companyId, parkingId)
      setReport(summary)

      // Transform daily breakdown for chart
      const chartData = summary.dailyBreakdown.map((day) => ({
        label: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: day.revenue,
        date: day.date,
      }))
      setChartData(chartData)
    } catch (error) {
      console.error("Failed to load financial summary:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Financial Summary</h3>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Financial Summary</h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No financial data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Financial Summary</h3>
          <span className="text-sm text-gray-500">
            {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${report.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{report.totalSessions.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">${report.averageRevenuePerSession.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Avg per Session</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${report.growthRate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {report.growthRate >= 0 ? "+" : ""}
              {report.growthRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Growth Rate</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Daily Revenue Trend</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Peak vs Off-Peak */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800">Peak Hours Revenue</h4>
            <p className="text-xl font-bold text-blue-600">${report.peakHourRevenue.toLocaleString()}</p>
            <p className="text-sm text-blue-600">
              {((report.peakHourRevenue / report.totalRevenue) * 100).toFixed(1)}% of total
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800">Off-Peak Revenue</h4>
            <p className="text-xl font-bold text-gray-600">${report.offPeakRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">
              {((report.offPeakRevenue / report.totalRevenue) * 100).toFixed(1)}% of total
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
