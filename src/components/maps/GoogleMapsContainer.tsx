"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api"
import type { ParkingMarker, MapLocation, InfoWindowData } from "@/types/maps.types"
import { DEFAULT_MAP_CONFIG, MAP_OPTIONS } from "@/config/maps.config"
import { mapsService } from "@/services/maps.service"
import { ParkingInfoWindow } from "./ParkingInfoWindow"
import { MapSearchBox } from "./MapSearchBox"
import { MapControls } from "./MapControls"
import { MapErrorBoundary } from "./MapErrorBoundary"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { google } from "google-maps"

// Add this after the imports
if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
  console.error("Google Maps API key is not configured. Please set REACT_APP_GOOGLE_MAPS_API_KEY environment variable.")
}

interface GoogleMapsContainerProps {
  markers: ParkingMarker[]
  onMarkerClick?: (marker: ParkingMarker) => void
  onMapClick?: (location: MapLocation) => void
  selectedMarkerId?: string
  showSearch?: boolean
  showControls?: boolean
  height?: string
  className?: string
}

const libraries: ("places" | "geometry")[] = ["places", "geometry"]

export const GoogleMapsContainer: React.FC<GoogleMapsContainerProps> = ({
  markers,
  onMarkerClick,
  onMapClick,
  selectedMarkerId,
  showSearch = true,
  showControls = true,
  height = "400px",
  className = "",
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<InfoWindowData | null>(null)
  const [mapCenter, setMapCenter] = useState<MapLocation>(DEFAULT_MAP_CONFIG.center)
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_MAP_CONFIG.zoom)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mapRef = useRef<google.maps.Map | null>(null)

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map
      setMap(map)
      mapsService.initializeServices(map)
      setIsLoading(false)

      // Fit bounds to show all markers if available
      if (markers.length > 0) {
        const bounds = mapsService.getBoundsFromMarkers(markers)
        map.fitBounds(bounds)
      }
    },
    [markers],
  )

  const onUnmount = useCallback(() => {
    mapRef.current = null
    setMap(null)
  }, [])

  const handleMarkerClick = useCallback(
    (marker: ParkingMarker) => {
      setSelectedMarker({
        marker,
        position: marker.position,
      })
      onMarkerClick?.(marker)
    },
    [onMarkerClick],
  )

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const location: MapLocation = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        }
        onMapClick?.(location)
      }
      setSelectedMarker(null)
    },
    [onMapClick],
  )

  const handleSearchResult = useCallback(
    (location: MapLocation, zoom?: number) => {
      if (map) {
        map.panTo(location)
        if (zoom) {
          map.setZoom(zoom)
        }
        setMapCenter(location)
      }
    },
    [map],
  )

  const getMarkerIcon = (marker: ParkingMarker): google.maps.Icon => {
    const isSelected = selectedMarkerId === marker.id
    const availabilityRatio = marker.availableSpaces / marker.totalSpaces

    let color = "#ef4444" // red for low availability
    if (availabilityRatio > 0.5)
      color = "#22c55e" // green for high availability
    else if (availabilityRatio > 0.2) color = "#f59e0b" // yellow for medium availability

    if (marker.status !== "ACTIVE") color = "#6b7280" // gray for inactive

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" 
                fill="${color}" stroke="#ffffff" strokeWidth="2"/>
          <circle cx="16" cy="16" r="8" fill="#ffffff"/>
          <text x="16" y="20" textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="${color}">
            ${marker.availableSpaces}
          </text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(isSelected ? 40 : 32, isSelected ? 50 : 40),
      anchor: new google.maps.Point(isSelected ? 20 : 16, isSelected ? 50 : 40),
    }
  }

  const handleLoadError = useCallback(() => {
    setError("Failed to load Google Maps. Please check your internet connection and try again.")
    setIsLoading(false)
  }, [])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center p-6">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setIsLoading(true)
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <MapErrorBoundary>
      <div className={`relative ${className}`} style={{ height }}>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}
          libraries={libraries}
          onError={handleLoadError}
          loadingElement={
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          {showSearch && (
            <div className="absolute top-4 left-4 right-4 z-10">
              <MapSearchBox
                map={map}
                onPlaceSelect={handleSearchResult}
                placeholder="Search for parking lots or addresses..."
              />
            </div>
          )}

          {showControls && (
            <div className="absolute top-4 right-4 z-10">
              <MapControls map={map} markers={markers} onCenterChange={setMapCenter} onZoomChange={setMapZoom} />
            </div>
          )}

          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={mapZoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={MAP_OPTIONS}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                icon={getMarkerIcon(marker)}
                onClick={() => handleMarkerClick(marker)}
                animation={selectedMarkerId === marker.id ? google.maps.Animation.BOUNCE : undefined}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
                options={{
                  pixelOffset: new google.maps.Size(0, -40),
                }}
              >
                <ParkingInfoWindow marker={selectedMarker.marker} />
              </InfoWindow>
            )}
          </GoogleMap>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <LoadingSpinner size="lg" />
            </div>
          )}
        </LoadScript>
      </div>
    </MapErrorBoundary>
  )
}

export default GoogleMapsContainer
