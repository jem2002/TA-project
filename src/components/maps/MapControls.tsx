"use client"

import type React from "react"
import type { ParkingMarker, MapLocation } from "@/types/maps.types"
import Button from "@/components/ui/Button"
import { mapsService } from "@/services/maps.service"
import type { google } from "google-maps"

interface MapControlsProps {
  map: google.maps.Map | null
  markers: ParkingMarker[]
  onCenterChange: (center: MapLocation) => void
  onZoomChange: (zoom: number) => void
}

export const MapControls: React.FC<MapControlsProps> = ({ map, markers, onCenterChange, onZoomChange }) => {
  const handleFitToMarkers = () => {
    if (map && markers.length > 0) {
      const bounds = mapsService.getBoundsFromMarkers(markers)
      map.fitBounds(bounds)
    }
  }

  const handleCurrentLocation = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: MapLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          map.panTo(location)
          map.setZoom(15)
          onCenterChange(location)
          onZoomChange(15)
        },
        (error) => {
          console.error("Error getting current location:", error)
        },
      )
    }
  }

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 10
      const newZoom = Math.min(currentZoom + 1, 20)
      map.setZoom(newZoom)
      onZoomChange(newZoom)
    }
  }

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 10
      const newZoom = Math.max(currentZoom - 1, 1)
      map.setZoom(newZoom)
      onZoomChange(newZoom)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-none border-b"
          title="Zoom In"
        >
          +
        </Button>
        <Button variant="ghost" size="sm" onClick={handleZoomOut} className="w-10 h-10 rounded-none" title="Zoom Out">
          −
        </Button>
      </div>

      {/* Location Controls */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCurrentLocation}
          className="w-10 h-10 rounded-none border-b"
          title="My Location"
        >
          📍
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFitToMarkers}
          className="w-10 h-10 rounded-none"
          title="Show All Parking"
        >
          🎯
        </Button>
      </div>
    </div>
  )
}

export default MapControls
