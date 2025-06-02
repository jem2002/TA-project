import type { MapLocation, SearchResult, ParkingMarker } from "@/types/maps.types"
import * as google from "google.maps"

class MapsService {
  private geocoder: google.maps.Geocoder | null = null
  private placesService: google.maps.places.PlacesService | null = null

  initializeServices(map: google.maps.Map) {
    this.geocoder = new google.maps.Geocoder()
    this.placesService = new google.maps.places.PlacesService(map)
  }

  async geocodeAddress(address: string): Promise<MapLocation | null> {
    if (!this.geocoder) {
      throw new Error("Geocoder not initialized")
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location
          resolve({
            lat: location.lat(),
            lng: location.lng(),
          })
        } else {
          reject(new Error(`Geocoding failed: ${status}`))
        }
      })
    })
  }

  async searchPlaces(query: string, location?: MapLocation): Promise<SearchResult[]> {
    if (!this.placesService) {
      throw new Error("Places service not initialized")
    }

    const request: google.maps.places.TextSearchRequest = {
      query,
      ...(location && {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: 50000, // 50km radius
      }),
    }

    return new Promise((resolve, reject) => {
      this.placesService!.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const searchResults: SearchResult[] = results.map((place) => ({
            placeId: place.place_id || "",
            name: place.name || "",
            address: place.formatted_address || "",
            location: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            },
            types: place.types || [],
          }))
          resolve(searchResults)
        } else {
          reject(new Error(`Places search failed: ${status}`))
        }
      })
    })
  }

  calculateDistance(from: MapLocation, to: MapLocation): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(to.lat - from.lat)
    const dLng = this.toRadians(to.lng - from.lng)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(from.lat)) * Math.cos(this.toRadians(to.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  getBoundsFromMarkers(markers: ParkingMarker[]): google.maps.LatLngBounds {
    const bounds = new google.maps.LatLngBounds()
    markers.forEach((marker) => {
      bounds.extend(new google.maps.LatLng(marker.position.lat, marker.position.lng))
    })
    return bounds
  }
}

export const mapsService = new MapsService()
export default mapsService
