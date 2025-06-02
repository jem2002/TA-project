"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { Card, CardContent } from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { ParkingAvailabilityList } from "@/components/customer/ParkingAvailabilityList"
import { ReservationQuickBook } from "@/components/customer/ReservationQuickBook"
import { LoyaltyOverview } from "@/components/customer/LoyaltyOverview"
import { RecentReservations } from "@/components/customer/RecentReservations"
import { FilterPanel } from "@/components/customer/FilterPanel"
import { fetchParkingAvailability, fetchReservations, fetchLoyaltyAccount } from "@/store/slices/customerSlice"
import { useAuth } from "@/hooks/useAuth"
import { GoogleMapsContainer } from "@/components/maps/GoogleMapsContainer"
import type { ParkingMarker } from "@/types/maps.types"
import type { ParkingAvailability } from "@/types/parking.types"
import { setSelectedParking } from "@/store/slices/customerSlice"

export const CustomerDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [showFilters, setShowFilters] = useState(false)

  const { parkingAvailability, isLoadingAvailability, loyaltyAccount, reservations, error, successMessage } =
    useSelector((state: RootState) => state.customer)

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchParkingAvailability())
    dispatch(fetchReservations({ page: 0, limit: 5 }))
    dispatch(fetchLoyaltyAccount())
  }, [dispatch])

  const handleRefreshAvailability = () => {
    dispatch(fetchParkingAvailability())
  }

  const convertToMarkers = (parkingData: ParkingAvailability[]): ParkingMarker[] => {
    return parkingData.map((parking) => ({
      id: parking.parkingId,
      position: parking.coordinates,
      title: parking.parkingName,
      address: parking.address,
      totalSpaces: parking.totalSpaces,
      availableSpaces: parking.availableSpaces,
      hourlyRate: parking.hourlyRate,
      amenities: parking.amenities,
      status: "ACTIVE" as const,
      companyId: "", // Add from parking data
      parkingId: parking.parkingId,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Parking</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <span>🔍</span>
                <span>Filters</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleRefreshAvailability}
                disabled={isLoadingAvailability}
                className="flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 mx-4 mt-4 rounded-lg">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mx-4 mt-4 rounded-lg">{error}</div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Book */}
            <ReservationQuickBook />

            {/* Loyalty Overview */}
            <LoyaltyOverview loyaltyAccount={loyaltyAccount} />

            {/* Recent Reservations */}
            <RecentReservations reservations={reservations.slice(0, 3)} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filter Panel */}
            {showFilters && (
              <div className="mb-6">
                <FilterPanel onClose={() => setShowFilters(false)} />
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Available Parking ({parkingAvailability.length})
                </h2>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "map" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="flex items-center space-x-2"
                >
                  <span>🗺️</span>
                  <span>Map</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center space-x-2"
                >
                  <span>📋</span>
                  <span>List</span>
                </Button>
              </div>
            </div>

            {/* Parking Display */}
            <Card>
              <CardContent className="p-0">
                {viewMode === "map" ? (
                  <GoogleMapsContainer
                    markers={convertToMarkers(parkingAvailability)}
                    onMarkerClick={(marker) => {
                      const parking = parkingAvailability.find((p) => p.parkingId === marker.parkingId)
                      if (parking) {
                        dispatch(setSelectedParking(parking))
                      }
                    }}
                    showSearch={true}
                    showControls={true}
                    height="500px"
                    className="rounded-lg overflow-hidden"
                  />
                ) : (
                  <ParkingAvailabilityList parkingData={parkingAvailability} isLoading={isLoadingAvailability} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
