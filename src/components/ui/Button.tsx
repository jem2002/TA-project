import type React from "react"
import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/utils/cn"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "btn inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variants = {
      primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
      secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    }

    const sizes = {
      sm: "h-8 px-3 text-sm rounded-md",
      md: "h-10 px-4 py-2 rounded-md",
      lg: "h-12 px-6 text-lg rounded-lg",
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], isLoading && "relative text-transparent", className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 loading-spinner" />
          </div>
        )}
        {!isLoading && (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = "Button"

export default Button
