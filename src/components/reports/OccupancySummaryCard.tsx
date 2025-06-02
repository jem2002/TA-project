"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { OccupancyReport, ChartDataPoint } from "@/types/reports.types"
import reportsService from "@/services/reports.service"

interface OccupancySummaryCardProps {
  companyId?: string
  parkingId?: string
}

export const OccupancySummaryCard: React.FC<OccupancySummaryCardProps> = ({ companyId, parkingId }) => {
  const [report, setReport] = useState<OccupancyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [hourlyData, setHourlyData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    loadOccupancySummary()
  }, [companyId, parkingId])

  const loadOccupancySummary = async () => {
    try {
      setLoading(true)
      const summary = await reportsService.getDashboardOccupancySummary(companyId, parkingId)
      setReport(summary)

      // Transform hourly breakdown for chart
      const hourlyData = summary.hourlyBreakdown.map((hour) => ({
        label: `${hour.hour}:00`,
        value: hour.averageOccupancy,
        hour: hour.hour,
      }))
      setHourlyData(hourlyData)
    } catch (error) {
      console.error("Failed to load occupancy summary:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Occupancy Summary</h3>
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
          <h3 className="text-lg font-semibold">Occupancy Summary</h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No occupancy data available</p>
        </CardContent>
      </Card>
    )
  }

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return "text-red-600"
    if (rate >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  const getOccupancyBgColor = (rate: number) => {
    if (rate >= 80) return "bg-red-50"
    if (rate >= 60) return "bg-yellow-50"
    return "bg-green-50"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Occupancy Summary</h3>
          <span className="text-sm text-gray-500">
            {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className={`text-2xl font-bold ${getOccupancyColor(report.averageOccupancyRate)}`}>
              {report.averageOccupancyRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Avg Occupancy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{report.peakOccupancyRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">Peak Occupancy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{report.totalSpaces.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Spaces</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{report.turnoverRate.toFixed(1)}</p>
            <p className="text-sm text-gray-500">Turnover Rate</p>
          </div>
        </div>

        {/* Hourly Occupancy Chart */}
        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Hourly Occupancy Pattern</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, "Occupancy"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Times */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className={`p-4 rounded-lg ${getOccupancyBgColor(report.peakOccupancyRate)}`}>
            <h4 className="text-sm font-medium text-gray-800">Peak Time</h4>
            <p className={`text-xl font-bold ${getOccupancyColor(report.peakOccupancyRate)}`}>
              {new Date(report.peakOccupancyTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-gray-600">{report.peakOccupancyRate.toFixed(1)}% occupied</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800">Lowest Time</h4>
            <p className="text-xl font-bold text-green-600">
              {new Date(report.lowestOccupancyTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-gray-600">{report.lowestOccupancyRate.toFixed(1)}% occupied</p>
          </div>
        </div>

        {/* Zone Breakdown */}
        {report.zoneBreakdown && report.zoneBreakdown.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Zone Utilization</h4>
            <div className="space-y-2">
              {report.zoneBreakdown.map((zone, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{zone.zoneName}</p>
                    <p className="text-sm text-gray-500">{zone.totalSpaces} spaces</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getOccupancyColor(zone.averageOccupancy)}`}>
                      {zone.averageOccupancy.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">{zone.utilizationRate.toFixed(1)}% efficiency</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
