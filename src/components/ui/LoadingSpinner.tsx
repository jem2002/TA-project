import type React from "react"
import { cn } from "@/utils/cn"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  color?: "primary" | "secondary" | "white"
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md", className, color = "primary" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  const colors = {
    primary: "border-primary-600",
    secondary: "border-secondary-600",
    white: "border-white",
  }

  return (
    <div
      className={cn(
        "loading-spinner border-2 border-gray-300 border-t-transparent rounded-full animate-spin",
        sizes[size],
        colors[color],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
