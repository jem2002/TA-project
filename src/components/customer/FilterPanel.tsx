"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { setFilters, fetchParkingAvailability } from "@/store/slices/customerSlice"
import type { CustomerFilters } from "@/types/customer.types"

interface FilterPanelProps {
  onClose: () => void
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { filters } = useSelector((state: RootState) => state.customer)

  const [localFilters, setLocalFilters] = useState<CustomerFilters>(filters)

  const handleFilterChange = (key: keyof CustomerFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters))
    dispatch(fetchParkingAvailability(localFilters))
    onClose()
  }

  const handleClearFilters = () => {
    const emptyFilters: CustomerFilters = {}
    setLocalFilters(emptyFilters)
    dispatch(setFilters(emptyFilters))
    dispatch(fetchParkingAvailability())
  }

  const amenityOptions = [
    "Security Camera",
    "24/7 Access",
    "Electric Charging",
    "Covered Parking",
    "Wheelchair Accessible",
    "Car Wash",
    "Valet Service",
    "Restrooms",
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filter Parking Options</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
          <select
            value={localFilters.vehicleType || ""}
            onChange={(e) => handleFilterChange("vehicleType", e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Vehicle</option>
            <option value="CAR">Car</option>
            <option value="MOTORCYCLE">Motorcycle</option>
            <option value="TRUCK">Truck</option>
            <option value="VAN">Van</option>
          </select>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Hourly Rate</label>
          <Input
            type="number"
            placeholder="Enter max price"
            value={localFilters.maxPrice || ""}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        {/* Location Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Radius (km)</label>
          <select
            value={localFilters.location?.radius || ""}
            onChange={(e) => {
              const radius = e.target.value ? Number(e.target.value) : undefined
              if (radius && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  handleFilterChange("location", {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    radius,
                  })
                })
              } else {
                handleFilterChange("location", undefined)
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Distance</option>
            <option value="1">Within 1 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
          </select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filters</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.availableNow || false}
                onChange={(e) => handleFilterChange("availableNow", e.target.checked || undefined)}
                className="mr-2"
              />
              <span className="text-sm">Available Now</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.electricCharging || false}
                onChange={(e) => handleFilterChange("electricCharging", e.target.checked || undefined)}
                className="mr-2"
              />
              <span className="text-sm">Electric Charging</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.accessible || false}
                onChange={(e) => handleFilterChange("accessible", e.target.checked || undefined)}
                className="mr-2"
              />
              <span className="text-sm">Wheelchair Accessible</span>
            </label>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="grid grid-cols-2 gap-2">
            {amenityOptions.map((amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.amenities?.includes(amenity) || false}
                  onChange={(e) => {
                    const currentAmenities = localFilters.amenities || []
                    if (e.target.checked) {
                      handleFilterChange("amenities", [...currentAmenities, amenity])
                    } else {
                      handleFilterChange(
                        "amenities",
                        currentAmenities.filter((a) => a !== amenity),
                      )
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-xs">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default FilterPanel
