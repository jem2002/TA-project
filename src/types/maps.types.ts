import type * as google from "google.maps"

export interface MapLocation {
  lat: number
  lng: number
}

export interface ParkingMarker {
  id: string
  position: MapLocation
  title: string
  address: string
  totalSpaces: number
  availableSpaces: number
  hourlyRate: number
  amenities: string[]
  status: "ACTIVE" | "MAINTENANCE" | "CLOSED"
  companyId: string
  parkingId: string
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface SearchResult {
  placeId: string
  name: string
  address: string
  location: MapLocation
  types: string[]
}

export interface MapConfig {
  center: MapLocation
  zoom: number
  mapTypeId: string
  styles?: google.maps.MapTypeStyle[]
  options?: google.maps.MapOptions
}

export interface InfoWindowData {
  marker: ParkingMarker
  position: MapLocation
}
