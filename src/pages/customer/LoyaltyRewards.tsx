"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { fetchLoyaltyAccount, fetchAvailableRewards } from "@/store/slices/customerSlice"

export const LoyaltyRewards: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loyaltyAccount, availableRewards, isLoadingLoyalty } = useSelector((state: RootState) => state.customer)

  const [selectedTab, setSelectedTab] = useState<"overview" | "rewards" | "history">("overview")

  useEffect(() => {
    dispatch(fetchLoyaltyAccount())
    dispatch(fetchAvailableRewards())
  }, [dispatch])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "BRONZE":
        return "from-amber-400 to-amber-600"
      case "SILVER":
        return "from-gray-400 to-gray-600"
      case "GOLD":
        return "from-yellow-400 to-yellow-600"
      case "PLATINUM":
        return "from-purple-400 to-purple-600"
      default:
        return "from-gray-400 to-gray-600"
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

  if (!loyaltyAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-xl font-semibold mb-2">Loading your loyalty information...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Loyalty & Rewards</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Loyalty Status Card */}
        <Card className="mb-6 overflow-hidden">
          <div className={`bg-gradient-to-r ${getTierColor(loyaltyAccount.tier)} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">{getTierIcon(loyaltyAccount.tier)}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{loyaltyAccount.tier} Member</h2>
                    <p className="opacity-90">
                      Member since {new Date(loyaltyAccount.memberSince).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{loyaltyAccount.currentPoints.toLocaleString()}</div>
                <p className="opacity-90">Available Points</p>
              </div>
            </div>

            {loyaltyAccount.pointsToNextTier > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm opacity-90 mb-1">
                  <span>Progress to next tier</span>
                  <span>{loyaltyAccount.pointsToNextTier} points to go</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((loyaltyAccount.nextTierPoints - loyaltyAccount.pointsToNextTier) / loyaltyAccount.nextTierPoints) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
          <Button
            variant={selectedTab === "overview" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant={selectedTab === "rewards" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab("rewards")}
          >
            Available Rewards
          </Button>
          <Button
            variant={selectedTab === "history" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab("history")}
          >
            Points History
          </Button>
        </div>

        {/* Tab Content */}
        {selectedTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Points Summary */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Points Summary</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Earned:</span>
                  <span className="font-semibold">{loyaltyAccount.totalEarned.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Redeemed:</span>
                  <span className="font-semibold">{loyaltyAccount.totalRedeemed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className="font-bold text-lg">{loyaltyAccount.currentPoints.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* How to Earn Points */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">How to Earn Points</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <div className="font-medium">Park & Pay</div>
                    <div className="text-sm text-gray-600">1 point per $1 spent</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <div className="font-medium">Advance Booking</div>
                    <div className="text-sm text-gray-600">2x points for reservations</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="font-medium">Monthly Goals</div>
                    <div className="text-sm text-gray-600">Bonus points for frequent use</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tier Benefits */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Your Tier Benefits</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <div className="font-medium">5% Discount</div>
                    <div className="text-sm text-gray-600">On all parking fees</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-medium">Priority Booking</div>
                    <div className="text-sm text-gray-600">Reserve premium spots first</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <div className="font-medium">Exclusive Rewards</div>
                    <div className="text-sm text-gray-600">Access to special offers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === "rewards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{reward.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{reward.pointsCost.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reward.type === "DISCOUNT"
                          ? "bg-green-100 text-green-800"
                          : reward.type === "FREE_PARKING"
                            ? "bg-blue-100 text-blue-800"
                            : reward.type === "UPGRADE"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {reward.type.replace("_", " ")}
                    </span>
                    <span className="text-sm text-gray-600">
                      Valid until {new Date(reward.validUntil).toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!reward.isAvailable || loyaltyAccount.currentPoints < reward.pointsCost}
                  >
                    {loyaltyAccount.currentPoints < reward.pointsCost
                      ? `Need ${(reward.pointsCost - loyaltyAccount.currentPoints).toLocaleString()} more points`
                      : "Redeem Reward"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === "history" && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Points History</h3>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>Points history will be displayed here</p>
                <p className="text-sm mt-2">Track all your earned and redeemed points</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default LoyaltyRewards
