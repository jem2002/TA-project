import type { MapLocation, ParkingMarker } from "@/types/maps.types"
import * as google from "google.maps"

export const mapUtils = {
  // Calculate center point of multiple locations
  calculateCenter(locations: MapLocation[]): MapLocation {
    if (locations.length === 0) {
      return { lat: 0, lng: 0 }
    }

    const sum = locations.reduce(
      (acc, location) => ({
        lat: acc.lat + location.lat,
        lng: acc.lng + location.lng,
      }),
      { lat: 0, lng: 0 },
    )

    return {
      lat: sum.lat / locations.length,
      lng: sum.lng / locations.length,
    }
  },

  // Format distance for display
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`
    }
    return `${distanceKm.toFixed(1)}km`
  },

  // Get appropriate zoom level based on distance
  getZoomLevel(distanceKm: number): number {
    if (distanceKm < 1) return 16
    if (distanceKm < 5) return 14
    if (distanceKm < 10) return 13
    if (distanceKm < 25) return 11
    if (distanceKm < 50) return 10
    return 9
  },

  // Check if location is within bounds
  isLocationInBounds(location: MapLocation, bounds: google.maps.LatLngBounds): boolean {
    return bounds.contains(new google.maps.LatLng(location.lat, location.lng))
  },

  // Generate marker clusters for better performance
  clusterMarkers(markers: ParkingMarker[], zoomLevel: number): ParkingMarker[][] {
    if (zoomLevel > 12) return markers.map((marker) => [marker])

    const clusters: ParkingMarker[][] = []
    const processed = new Set<string>()

    markers.forEach((marker) => {
      if (processed.has(marker.id)) return

      const cluster = [marker]
      processed.add(marker.id)

      // Find nearby markers to cluster
      markers.forEach((otherMarker) => {
        if (processed.has(otherMarker.id)) return

        const distance = this.calculateDistance(marker.position, otherMarker.position)
        const clusterRadius = zoomLevel < 10 ? 2 : 1 // km

        if (distance < clusterRadius) {
          cluster.push(otherMarker)
          processed.add(otherMarker.id)
        }
      })

      clusters.push(cluster)
    })

    return clusters
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance(from: MapLocation, to: MapLocation): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(to.lat - from.lat)
    const dLng = this.toRadians(to.lng - from.lng)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(from.lat)) * Math.cos(this.toRadians(to.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  },

  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  },
}

export default mapUtils
