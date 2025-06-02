"use client"

import { useState, useCallback } from "react"
import type { MapLocation, ParkingMarker } from "@/types/maps.types"
import { mapsService } from "@/services/maps.service"
import type { google } from "google-maps"

interface UseGoogleMapsProps {
  markers: ParkingMarker[]
  initialCenter?: MapLocation
  initialZoom?: number
}

export const useGoogleMaps = ({ markers, initialCenter, initialZoom = 12 }: UseGoogleMapsProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<ParkingMarker | null>(null)

  // Initialize map
  const onMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance)
      mapsService.initializeServices(mapInstance)
      setIsLoaded(true)

      // Fit bounds to markers if available
      if (markers.length > 0) {
        const bounds = mapsService.getBoundsFromMarkers(markers)
        mapInstance.fitBounds(bounds)
      }
    },
    [markers],
  )

  // Get user location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: MapLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          if (map) {
            map.panTo(location)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Unable to get your current location")
        },
      )
    } else {
      setError("Geolocation is not supported by this browser")
    }
  }, [map])

  // Search for places
  const searchPlaces = useCallback(
    async (query: string) => {
      if (!map) return []

      try {
        const results = await mapsService.searchPlaces(query, userLocation || undefined)
        return results
      } catch (error) {
        console.error("Search error:", error)
        setError("Search failed. Please try again.")
        return []
      }
    },
    [map, userLocation],
  )

  // Calculate distances from user location
  const markersWithDistance = useCallback(() => {
    if (!userLocation) return markers

    return markers.map((marker) => ({
      ...marker,
      distance: mapsService.calculateDistance(userLocation, marker.position),
    }))
  }, [markers, userLocation])

  return {
    map,
    isLoaded,
    error,
    userLocation,
    selectedMarker,
    setSelectedMarker,
    onMapLoad,
    getCurrentLocation,
    searchPlaces,
    markersWithDistance: markersWithDistance(),
    clearError: () => setError(null),
  }
}

export default useGoogleMaps
