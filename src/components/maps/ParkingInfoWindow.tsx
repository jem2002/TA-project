"use client"

import type React from "react"
import type { ParkingMarker } from "@/types/maps.types"
import Button from "@/components/ui/Button"

interface ParkingInfoWindowProps {
  marker: ParkingMarker
  onReserve?: (parkingId: string) => void
  onViewDetails?: (parkingId: string) => void
}

export const ParkingInfoWindow: React.FC<ParkingInfoWindowProps> = ({ marker, onReserve, onViewDetails }) => {
  const availabilityPercentage = (marker.availableSpaces / marker.totalSpaces) * 100

  const getAvailabilityColor = () => {
    if (availabilityPercentage > 50) return "text-green-600"
    if (availabilityPercentage > 20) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusBadge = () => {
    const statusColors = {
      ACTIVE: "bg-green-100 text-green-800",
      MAINTENANCE: "bg-yellow-100 text-yellow-800",
      CLOSED: "bg-red-100 text-red-800",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[marker.status]}`}>
        {marker.status}
      </span>
    )
  }

  return (
    <div className="p-4 max-w-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{marker.title}</h3>
          <p className="text-sm text-gray-600">{marker.address}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Availability */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Availability</span>
          <span className={`text-sm font-bold ${getAvailabilityColor()}`}>
            {marker.availableSpaces}/{marker.totalSpaces} spaces
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              availabilityPercentage > 50
                ? "bg-green-500"
                : availabilityPercentage > 20
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Hourly Rate</span>
          <span className="text-lg font-bold text-blue-600">${marker.hourlyRate}</span>
        </div>
      </div>

      {/* Amenities */}
      {marker.amenities.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
          <div className="flex flex-wrap gap-1">
            {marker.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {amenity}
              </span>
            ))}
            {marker.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{marker.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {marker.status === "ACTIVE" && marker.availableSpaces > 0 && (
          <Button size="sm" onClick={() => onReserve?.(marker.parkingId)} className="flex-1">
            Reserve Now
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onViewDetails?.(marker.parkingId)} className="flex-1">
          View Details
        </Button>
      </div>

      {/* Directions link */}
      <div className="mt-3 pt-3 border-t">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${marker.position.lat},${marker.position.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          <span className="mr-1">🧭</span>
          Get Directions
        </a>
      </div>
    </div>
  )
}

export default ParkingInfoWindow
