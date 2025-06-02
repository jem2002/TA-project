"use client"

import type React from "react"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { LogIn, LogOut, DollarSign, Receipt, Car } from "lucide-react"

interface QuickAction {
  id: string
  label: string
  action: () => void
  icon: string
  color: string
}

interface QuickActionsProps {
  actions: QuickAction[]
  currentMode: string
  onModeChange: (mode: string) => void
}

const iconMap = {
  LogIn,
  LogOut,
  DollarSign,
  Receipt,
  Car,
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions, currentMode, onModeChange }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => {
          const IconComponent = iconMap[action.icon as keyof typeof iconMap]
          const isActive =
            currentMode === action.id.replace("vehicle-", "").replace("process-", "").replace("generate-", "")

          return (
            <Button
              key={action.id}
              onClick={action.action}
              variant={isActive ? "default" : "outline"}
              className={`w-full justify-start h-12 ${isActive ? action.color : "hover:bg-gray-50"}`}
            >
              <IconComponent className="mr-3 h-5 w-5" />
              {action.label}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
