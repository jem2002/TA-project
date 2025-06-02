"use client"

import type React from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store"
import type { ParkingAvailability } from "@/types/customer.types"
import { setSelectedParking } from "@/store/slices/customerSlice"
import Button from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"

interface ParkingAvailabilityListProps {
  parkingData: ParkingAvailability[]
  isLoading: boolean
}

export const ParkingAvailabilityList: React.FC<ParkingAvailabilityListProps> = ({ parkingData, isLoading }) => {
  const dispatch = useDispatch<AppDispatch>()

  const handleBookNow = (parking: ParkingAvailability) => {
    dispatch(setSelectedParking(parking))
    // Navigate to booking page or open booking modal
  }

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage > 50) return { text: "High", color: "text-green-600", bg: "bg-green-100" }
    if (percentage > 20) return { text: "Medium", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { text: "Low", color: "text-red-600", bg: "bg-red-100" }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (parkingData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚗</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No parking available</h3>
        <p className="text-gray-600">Try adjusting your filters or search in a different area.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      {parkingData.map((parking) => {
        const availability = getAvailabilityStatus(parking.availableSpaces, parking.totalSpaces)

        return (
          <Card key={parking.parkingId} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{parking.parkingName}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${parking.hourlyRate}/hr</div>
                      <div className="text-sm text-gray-500">${parking.dailyRate}/day</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">{parking.address}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Available Spaces</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900">{parking.availableSpaces}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${availability.bg} ${availability.color}`}
                        >
                          {availability.text}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">Total Spaces</span>
                      <div className="text-lg font-semibold text-gray-900">{parking.totalSpaces}</div>
                    </div>

                    {parking.distance && (
                      <div>
                        <span className="text-sm text-gray-500">Distance</span>
                        <div className="text-lg font-semibold text-gray-900">{parking.distance.toFixed(1)} km</div>
                      </div>
                    )}

                    <div>
                      <span className="text-sm text-gray-500">Zones</span>
                      <div className="text-lg font-semibold text-gray-900">{parking.zones.length}</div>
                    </div>
                  </div>

                  {parking.amenities.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 mb-2 block">Amenities</span>
                      <div className="flex flex-wrap gap-2">
                        {parking.amenities.map((amenity) => (
                          <span key={amenity} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => handleBookNow(parking)}
                      disabled={parking.availableSpaces === 0}
                      className="flex items-center space-x-2"
                    >
                      <span>📅</span>
                      <span>Book Now</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      📍 Directions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default ParkingAvailabilityList
