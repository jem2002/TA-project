"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { StandaloneSearchBox } from "@react-google-maps/api"
import type { MapLocation } from "@/types/maps.types"
import Input from "@/components/ui/Input"
import type { google } from "google-maps"

interface MapSearchBoxProps {
  map: google.maps.Map | null
  onPlaceSelect: (location: MapLocation, zoom?: number) => void
  placeholder?: string
  className?: string
}

export const MapSearchBox: React.FC<MapSearchBoxProps> = ({
  map,
  onPlaceSelect,
  placeholder = "Search for a location...",
  className = "",
}) => {
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchValue, setSearchValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const onLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref)
  }

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces()

      if (places && places.length > 0) {
        const place = places[0]

        if (place.geometry && place.geometry.location) {
          const location: MapLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }

          // Determine appropriate zoom level based on place type
          let zoom = 15
          if (place.types?.includes("country")) zoom = 6
          else if (place.types?.includes("administrative_area_level_1")) zoom = 8
          else if (place.types?.includes("locality")) zoom = 12
          else if (place.types?.includes("neighborhood")) zoom = 14

          onPlaceSelect(location, zoom)

          // Clear the input
          if (inputRef.current) {
            inputRef.current.value = ""
          }
        }
      }
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue.trim() && searchBox) {
        setIsSearching(true)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchValue, searchBox])

  return (
    <div className={`relative ${className}`}>
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white shadow-lg border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </StandaloneSearchBox>

      {isSearching ? (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export default MapSearchBox
