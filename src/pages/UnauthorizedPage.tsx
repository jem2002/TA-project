"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import Button from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"

const UnauthorizedPage: React.FC = () => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-8">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>

          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an
            error.
          </p>

          <div className="space-y-3">
            <Link to="/dashboard">
              <Button variant="primary" className="w-full">
                Go to Dashboard
              </Button>
            </Link>

            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UnauthorizedPage
