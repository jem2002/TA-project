"use client"

import type React from "react"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks"
import { Card } from "../ui/Card"
import { updateActiveEntries } from "../../store/slices/cashierSlice"
import { cashierService } from "../../services/cashier.service"
import { Car, Clock } from "lucide-react"

export const ActiveEntriesPanel: React.FC = () => {
  const dispatch = useAppDispatch()
  const { activeEntries } = useAppSelector((state) => state.cashier)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const fetchActiveEntries = async () => {
      if (user?.parkingId) {
        try {
          const entries = await cashierService.getActiveEntries(user.parkingId)
          dispatch(updateActiveEntries(entries))
        } catch (error) {
          console.error("Failed to fetch active entries:", error)
        }
      }
    }

    fetchActiveEntries()
    const interval = setInterval(fetchActiveEntries, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [dispatch, user?.parkingId])

  const formatDuration = (entryTime: Date): string => {
    const duration = new Date().getTime() - new Date(entryTime).getTime()
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Car className="mr-2 h-5 w-5" />
          Active Entries
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {activeEntries.length}
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activeEntries.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No active entries</p>
        ) : (
          activeEntries.map((entry) => (
            <div key={entry.id} className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono font-semibold text-sm">{entry.licensePlate}</p>
                  <p className="text-xs text-gray-500">{entry.vehicleType}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatDuration(entry.entryTime)}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{new Date(entry.entryTime).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
