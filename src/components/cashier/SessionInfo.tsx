import type React from "react"
import { useAppSelector } from "../../hooks/redux.hooks"
import { Button } from "../ui/Button"
import { User, Clock, DollarSign, Car, LogOut } from "lucide-react"

export const SessionInfo: React.FC = () => {
  const { currentSession } = useAppSelector((state) => state.cashier)
  const { user } = useAppSelector((state) => state.auth)

  if (!currentSession) return null

  const sessionDuration = new Date().getTime() - new Date(currentSession.startTime).getTime()
  const hours = Math.floor(sessionDuration / (1000 * 60 * 60))
  const minutes = Math.floor((sessionDuration % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <div className="flex items-center text-sm text-gray-600">
          <User className="mr-1 h-4 w-4" />
          {user?.name}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="mr-1 h-4 w-4" />
          {hours}h {minutes}m
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center text-sm text-gray-600">
          <Car className="mr-1 h-4 w-4" />
          {currentSession.totalTransactions} transactions
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="mr-1 h-4 w-4" />${currentSession.totalAmount.toFixed(2)}
        </div>
      </div>

      <Button variant="outline" size="sm">
        <LogOut className="h-4 w-4 mr-2" />
        End Session
      </Button>
    </div>
  )
}
