"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { VehicleEntryForm } from "../../components/cashier/VehicleEntryForm"
import { VehicleExitForm } from "../../components/cashier/VehicleExitForm"
import { PaymentProcessor } from "../../components/cashier/PaymentProcessor"
import { ReceiptGenerator } from "../../components/cashier/ReceiptGenerator"
import { QuickActions } from "../../components/cashier/QuickActions"
import { SessionInfo } from "../../components/cashier/SessionInfo"
import { ActiveEntriesPanel } from "../../components/cashier/ActiveEntriesPanel"
import { startCashierSession } from "../../store/slices/cashierSlice"
import { Car, Clock } from "lucide-react"

type OperationMode = "entry" | "exit" | "payment" | "receipt" | "dashboard"

export const CashierDashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { currentSession, currentTransaction, isLoading, error } = useAppSelector((state) => state.cashier)
  const { user } = useAppSelector((state) => state.auth)

  const [currentMode, setCurrentMode] = useState<OperationMode>("dashboard")
  const [sessionStarted, setSessionStarted] = useState(false)

  useEffect(() => {
    if (currentSession) {
      setSessionStarted(true)
    }
  }, [currentSession])

  const handleStartSession = async () => {
    if (user) {
      await dispatch(
        startCashierSession({
          operatorId: user.id,
          initialCash: 0,
        }),
      )
    }
  }

  const quickActions = [
    {
      id: "vehicle-entry",
      label: "Vehicle Entry",
      action: () => setCurrentMode("entry"),
      icon: "LogIn",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "vehicle-exit",
      label: "Vehicle Exit",
      action: () => setCurrentMode("exit"),
      icon: "LogOut",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "process-payment",
      label: "Process Payment",
      action: () => setCurrentMode("payment"),
      icon: "DollarSign",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      id: "generate-receipt",
      label: "Generate Receipt",
      action: () => setCurrentMode("receipt"),
      icon: "Receipt",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-96 p-8">
          <div className="text-center">
            <Clock className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Cashier Session</h2>
            <p className="text-gray-600 mb-6">
              Welcome, {user?.name}. Please start your cashier session to begin operations.
            </p>
            <Button onClick={handleStartSession} disabled={isLoading} className="w-full">
              {isLoading ? "Starting Session..." : "Start Session"}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Cashier Terminal</h1>
            </div>
            <SessionInfo />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions actions={quickActions} currentMode={currentMode} onModeChange={setCurrentMode} />
            <div className="mt-6">
              <ActiveEntriesPanel />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {currentMode === "dashboard" && (
                <div className="text-center py-12">
                  <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Operation</h3>
                  <p className="text-gray-600">
                    Choose from the quick actions on the left to begin processing vehicles.
                  </p>
                </div>
              )}

              {currentMode === "entry" && (
                <VehicleEntryForm
                  onSuccess={() => setCurrentMode("dashboard")}
                  onCancel={() => setCurrentMode("dashboard")}
                />
              )}

              {currentMode === "exit" && (
                <VehicleExitForm
                  onSuccess={() => setCurrentMode("payment")}
                  onCancel={() => setCurrentMode("dashboard")}
                />
              )}

              {currentMode === "payment" && (
                <PaymentProcessor
                  onSuccess={() => setCurrentMode("receipt")}
                  onCancel={() => setCurrentMode("dashboard")}
                />
              )}

              {currentMode === "receipt" && <ReceiptGenerator onComplete={() => setCurrentMode("dashboard")} />}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
