"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { Card, CardContent } from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { ReservationBookingModal } from "@/components/customer/ReservationBookingModal"
import { ReservationDetailsModal } from "@/components/customer/ReservationDetailsModal"
import { fetchReservations } from "@/store/slices/customerSlice"
import type { Reservation } from "@/types/customer.types"

export const ReservationManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { reservations, isLoadingReservations } = useSelector((state: RootState) => state.customer)

  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("ALL")

  useEffect(() => {
    dispatch(fetchReservations({ page: 0, limit: 50 }))
  }, [dispatch])

  const filteredReservations = reservations.filter((reservation) => {
    if (filterStatus === "ALL") return true
    return reservation.status === filterStatus
  })

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>
            <Button onClick={() => setShowBookingModal(true)}>+ New Reservation</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
          {["ALL", "PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="capitalize"
            >
              {status.toLowerCase()}
            </Button>
          ))}
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{reservation.parkingName}</h3>
                        <p className="text-gray-600">{reservation.parkingAddress}</p>
                        <p className="text-sm text-gray-500 mt-1">Reservation #{reservation.reservationNumber}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}
                      >
                        {reservation.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Start Time</span>
                        <div className="font-medium">{new Date(reservation.startDateTime).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(reservation.startDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">End Time</span>
                        <div className="font-medium">{new Date(reservation.endDateTime).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(reservation.endDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Total Amount</span>
                        <div className="font-medium text-lg">${reservation.totalAmount.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">
                          {reservation.paymentStatus === "PAID" ? "✅ Paid" : "⏳ Pending"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>🚗 {reservation.vehicleLicensePlate}</span>
                        <span>📍 {reservation.spaceNumber || "Any available"}</span>
                        {reservation.loyaltyPointsEarned > 0 && (
                          <span>⭐ +{reservation.loyaltyPointsEarned} points</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedReservation(reservation)}>
                          View Details
                        </Button>
                        {reservation.status === "CONFIRMED" && (
                          <Button variant="outline" size="sm">
                            Modify
                          </Button>
                        )}
                        {["PENDING", "CONFIRMED"].includes(reservation.status) && (
                          <Button variant="outline" size="sm" className="text-red-600">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === "ALL"
                ? "You haven't made any reservations yet."
                : `No ${filterStatus.toLowerCase()} reservations.`}
            </p>
            <Button onClick={() => setShowBookingModal(true)}>Make Your First Reservation</Button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showBookingModal && <ReservationBookingModal onClose={() => setShowBookingModal(false)} />}

      {selectedReservation && (
        <ReservationDetailsModal reservation={selectedReservation} onClose={() => setSelectedReservation(null)} />
      )}
    </div>
  )
}

export default ReservationManagement
