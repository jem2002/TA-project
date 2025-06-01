"use client"

import type React from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import Button from "@/components/ui/Button"

const DashboardPage: React.FC = () => {
  const { user, logout, userRole, isAdmin, isCompanyAdmin } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parking Management Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{user?.role}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-responsive py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">User Information</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <p className="text-sm text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-sm text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Role:</span>
                  <p className="text-sm text-gray-900">{user?.role}</p>
                </div>
                {user?.companyName && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Company:</span>
                    <p className="text-sm text-gray-900">{user.companyName}</p>
                  </div>
                )}
                {user?.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <p className="text-sm text-gray-900">{user.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role-based Features */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Admin Features</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="primary" className="w-full">
                    Manage Companies
                  </Button>
                  <Button variant="primary" className="w-full">
                    Manage Users
                  </Button>
                  <Button variant="primary" className="w-full">
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isCompanyAdmin && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Company Management</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="primary" className="w-full">
                    Manage Parking Lots
                  </Button>
                  <Button variant="primary" className="w-full">
                    Manage Staff
                  </Button>
                  <Button variant="primary" className="w-full">
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Stats</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Last Login:</span>
                  <span className="text-sm font-medium">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "First time"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Account Status:</span>
                  <span className={`text-sm font-medium ${user?.isActive ? "text-green-600" : "text-red-600"}`}>
                    {user?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Member Since:</span>
                  <span className="text-sm font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity to display.</p>
                <p className="text-sm mt-2">Activity will appear here as you use the system.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
