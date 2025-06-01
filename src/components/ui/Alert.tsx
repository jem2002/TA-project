"use client"

import type React from "react"
import type { HTMLAttributes } from "react"
import { cn } from "@/utils/cn"

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info"
  title?: string
  onClose?: () => void
}

const Alert: React.FC<AlertProps> = ({ className, variant = "default", title, onClose, children, ...props }) => {
  const variants = {
    default: "bg-gray-50 border-gray-200 text-gray-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  const iconVariants = {
    default: "🔔",
    success: "✅",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️",
  }

  return (
    <div className={cn("border rounded-lg p-4 animate-fade-in", variants[variant], className)} {...props}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <span className="text-lg">{iconVariants[variant]}</span>
        </div>
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors">
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert
