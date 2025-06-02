"use client"

import type React from "react"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Card } from "../ui/Card"
import { searchVehicleEntry, calculateCharges } from "../../store/slices/cashierSlice"
import { Search, Car, Clock, DollarSign } from "lucide-react"

interface VehicleExitFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export const VehicleExitForm: React.FC<VehicleExitFormProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch()
  const { currentTransaction, isLoading } = useAppSelector((state) => state.cashier)
  const { user } = useAppSelector((state) => state.auth)

  const [licensePlate, setLicensePlate] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!licensePlate.trim()) {
      alert("Please enter a license plate number")
      return
    }

    try {
      const entry = await dispatch(
        searchVehicleEntry({
          licensePlate: licensePlate.toUpperCase(),
          parkingId: user?.parkingId || "",
        }),
      ).unwrap()

      if (entry) {
        // Calculate charges automatically
        await dispatch(
          calculateCharges({
            entryId: entry.id!,
            exitTime: new Date(),
          }),
        )
        setSearchPerformed(true)
      } else {
        alert("No active entry found for this license plate")
      }
    } catch (error) {
      console.error("Search failed:", error)
      alert("Vehicle not found or already exited")
    }
  }

  const handleProceedToPayment = () => {
    if (currentTransaction.entry && currentTransaction.charges) {
      onSuccess()
    }
  }

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Car className="mr-3 h-6 w-6" />
          Vehicle Exit
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {!searchPerformed ? (
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">License Plate Number</label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                placeholder="Enter license plate"
                className="flex-1 text-lg font-mono tracking-wider"
                required
              />
              <Button type="submit" disabled={isLoading} className="px-6">
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Vehicle Information */}
          {currentTransaction.entry && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">License Plate</span>
                  <p className="text-lg font-mono font-semibold">{currentTransaction.entry.licensePlate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Vehicle Type</span>
                  <p className="text-lg">{currentTransaction.entry.vehicleType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Entry Time</span>
                  <p className="text-lg">{new Date(currentTransaction.entry.entryTime).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Exit Time</span>
                  <p className="text-lg">{new Date().toLocaleString()}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Charge Calculation */}
          {currentTransaction.charges && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Charge Calculation
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Parking Duration</span>
                  <span className="font-semibold">{formatDuration(currentTransaction.charges.duration)}</span>
                </div>

                {currentTransaction.charges.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.description}</span>
                    <span className={`font-semibold ${item.type === "DISCOUNT" ? "text-green-600" : "text-gray-900"}`}>
                      {item.type === "DISCOUNT" ? "-" : ""}${item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${currentTransaction.charges.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button onClick={handleProceedToPayment} className="flex-1 bg-green-600 hover:bg-green-700">
              Proceed to Payment
            </Button>
            <Button variant="outline" onClick={() => setSearchPerformed(false)} className="flex-1">
              Search Again
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
