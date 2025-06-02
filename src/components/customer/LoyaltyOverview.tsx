"use client"

import type React from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store"
import type { LoyaltyAccount } from "@/types/customer.types"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import Button from "@/components/ui/Button"

interface LoyaltyOverviewProps {
  loyaltyAccount: LoyaltyAccount | null
}

export const LoyaltyOverview: React.FC<LoyaltyOverviewProps> = ({ loyaltyAccount }) => {
  const dispatch = useDispatch<AppDispatch>()

  if (!loyaltyAccount) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-2">⭐</div>
          <p className="text-gray-600 text-sm">Loading loyalty information...</p>
        </CardContent>
      </Card>
    )
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "BRONZE":
        return "text-amber-600 bg-amber-100"
      case "SILVER":
        return "text-gray-600 bg-gray-100"
      case "GOLD":
        return "text-yellow-600 bg-yellow-100"
      case "PLATINUM":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "BRONZE":
        return "🥉"
      case "SILVER":
        return "🥈"
      case "GOLD":
        return "🥇"
      case "PLATINUM":
        return "💎"
      default:
        return "⭐"
    }
  }

  const progressPercentage =
    loyaltyAccount.nextTierPoints > 0
      ? ((loyaltyAccount.nextTierPoints - loyaltyAccount.pointsToNextTier) / loyaltyAccount.nextTierPoints) * 100
      : 100

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <span>⭐</span>
          <span>Loyalty Status</span>
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Tier */}
        <div className="text-center">
          <div className="text-3xl mb-2">{getTierIcon(loyaltyAccount.tier)}</div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(loyaltyAccount.tier)}`}>
            {loyaltyAccount.tier}
          </span>
        </div>

        {/* Points Balance */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{loyaltyAccount.currentPoints.toLocaleString()}</div>
          <p className="text-sm text-gray-600">Available Points</p>
        </div>

        {/* Progress to Next Tier */}
        {loyaltyAccount.pointsToNextTier > 0 && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress to next tier</span>
              <span>{loyaltyAccount.pointsToNextTier} points to go</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">{loyaltyAccount.totalEarned.toLocaleString()}</div>
            <p className="text-xs text-gray-600">Total Earned</p>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{loyaltyAccount.totalRedeemed.toLocaleString()}</div>
            <p className="text-xs text-gray-600">Total Redeemed</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            View Rewards
          </Button>
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View History
          </Button>
        </div>

        {/* Member Since */}
        <div className="text-center text-xs text-gray-500">
          Member since {new Date(loyaltyAccount.memberSince).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}

export default LoyaltyOverview
