"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store"
import { GoogleMapsContainer } from "@/components/maps/GoogleMapsContainer"
import type { ParkingAvailability } from "@/types/customer.types"
import type { ParkingMarker, MapLocation } from "@/types/maps.types"
import { setSelectedParking } from "@/store/slices/customerSlice"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface ParkingAvailabilityMapProps {
  parkingData: ParkingAvailability[]
  isLoading: boolean
  selectedParkingId?: string
  onParkingSelect?: (parking: ParkingAvailability) => void
  filters?: {
    maxDistance?: number
    minAvailability?: number
    maxPrice?: number
    amenities?: string[]
  }
}

export const ParkingAvailabilityMap: React.FC<ParkingAvailabilityMapProps> = ({
  parkingData,
  isLoading,
  selectedParkingId,
  onParkingSelect,
  filters,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null)

  // Convert parking data to markers
  const markers = useMemo((): ParkingMarker[] => {
    return parkingData
      .filter((parking) => {
        // Apply filters
        if (filters?.minAvailability && parking.availableSpaces < filters.minAvailability) {
          return false
        }
        if (filters?.maxPrice && parking.hourlyRate > filters.maxPrice) {
          return false
        }
        if (filters?.amenities && filters.amenities.length > 0) {
          const hasRequiredAmenities = filters.amenities.every((amenity) => parking.amenities.includes(amenity))
          if (!hasRequiredAmenities) return false
        }
        return true
      })
      .map((parking) => ({
        id: parking.parkingId,
        position: parking.coordinates,
        title: parking.parkingName,
        address: parking.address,
        totalSpaces: parking.totalSpaces,
        availableSpaces: parking.availableSpaces,
        hourlyRate: parking.hourlyRate,
        amenities: parking.amenities,
        status: parking.isActive ? "ACTIVE" : "CLOSED",
        companyId: parking.companyId || "",
        parkingId: parking.parkingId,
      }))
  }, [parkingData, filters])

  const handleMarkerClick = useCallback(
    (marker: ParkingMarker) => {
      const parking = parkingData.find((p) => p.parkingId === marker.parkingId)
      if (parking) {
        dispatch(setSelectedParking(parking))
        onParkingSelect?.(parking)
      }
    },
    [parkingData, dispatch, onParkingSelect],
  )

  const handleMapClick = useCallback((location: MapLocation) => {
    // Optional: Handle map clicks for future features
    console.log("Map clicked at:", location)
  }, [])

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center p-6">
          <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Maps Configuration Required</h3>
          <p className="text-gray-600">Google Maps API key is not configured.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <GoogleMapsContainer
        markers={markers}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
        selectedMarkerId={selectedParkingId}
        showSearch={true}
        showControls={true}
        height="500px"
        className="rounded-lg overflow-hidden"
      />

      {/* Map Statistics Overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="text-sm">
          <div className="font-semibold text-gray-900">{markers.length} Parking Lots</div>
          <div className="text-gray-600">
            {markers.reduce((sum, marker) => sum + marker.availableSpaces, 0)} Available Spaces
          </div>
        </div>
      </div>

      {/* Current Location Button */}
      <button
        onClick={getCurrentLocation}
        className="absolute bottom-4 right-4 bg-white rounded-full shadow-lg p-3 hover:bg-gray-50 z-10"
        title="Get Current Location"
      >
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  )
}

export default ParkingAvailabilityMap
