"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { createReservation } from "@/store/slices/customerSlice"

export const ReservationQuickBook: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedParking, isLoadingReservations } = useSelector((state: RootState) => state.customer)

  const [formData, setFormData] = useState({
    startDateTime: "",
    endDateTime: "",
    vehicleType: "CAR",
    licensePlate: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleQuickBook = async () => {
    if (!selectedParking) return

    const reservationData = {
      parkingId: selectedParking.parkingId,
      vehicleType: formData.vehicleType,
      startDateTime: new Date(formData.startDateTime),
      endDateTime: new Date(formData.endDateTime),
      vehicleLicensePlate: formData.licensePlate,
    }

    dispatch(createReservation(reservationData))
  }

  const isFormValid = formData.startDateTime && formData.endDateTime && formData.licensePlate

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <span>⚡</span>
          <span>Quick Book</span>
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedParking ? (
          <>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">{selectedParking.parkingName}</h4>
              <p className="text-sm text-blue-700">{selectedParking.address}</p>
              <p className="text-sm font-medium text-blue-900 mt-1">${selectedParking.hourlyRate}/hr</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <Input
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) => handleInputChange("startDateTime", e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <Input
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) => handleInputChange("endDateTime", e.target.value)}
                min={formData.startDateTime}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select
                value={formData.vehicleType}
                onChange={(e) => handleInputChange("vehicleType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CAR">Car</option>
                <option value="MOTORCYCLE">Motorcycle</option>
                <option value="TRUCK">Truck</option>
                <option value="VAN">Van</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <Input
                type="text"
                placeholder="ABC-123"
                value={formData.licensePlate}
                onChange={(e) => handleInputChange("licensePlate", e.target.value.toUpperCase())}
              />
            </div>

            <Button onClick={handleQuickBook} disabled={!isFormValid || isLoadingReservations} className="w-full">
              {isLoadingReservations ? "Booking..." : "Book Now"}
            </Button>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🚗</div>
            <p className="text-gray-600 text-sm">Select a parking location to start booking</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ReservationQuickBook
