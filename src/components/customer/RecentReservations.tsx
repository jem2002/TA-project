"use client"

import type React from "react"
import type { Reservation } from "@/types/customer.types"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import Button from "@/components/ui/Button"

interface RecentReservationsProps {
  reservations: Reservation[]
}

export const RecentReservations: React.FC<RecentReservationsProps> = ({ reservations }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600 bg-green-100"
      case "ACTIVE":
        return "text-blue-600 bg-blue-100"
      case "PENDING":
        return "text-yellow-600 bg-yellow-100"
      case "COMPLETED":
        return "text-gray-600 bg-gray-100"
      case "CANCELLED":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "✅"
      case "ACTIVE":
        return "🚗"
      case "PENDING":
        return "⏳"
      case "COMPLETED":
        return "✔️"
      case "CANCELLED":
        return "❌"
      default:
        return "📋"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <span>📋</span>
            <span>Recent Bookings</span>
          </h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-gray-600 text-sm">No recent reservations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{reservation.parkingName}</h4>
                    <p className="text-xs text-gray-600">{reservation.parkingAddress}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {getStatusIcon(reservation.status)} {reservation.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                  <div>
                    <span className="font-medium">Start:</span>
                    <div>{new Date(reservation.startDateTime).toLocaleDateString()}</div>
                    <div>
                      {new Date(reservation.startDateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">End:</span>
                    <div>{new Date(reservation.endDateTime).toLocaleDateString()}</div>
                    <div>
                      {new Date(reservation.endDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">${reservation.totalAmount.toFixed(2)}</span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentReservations
