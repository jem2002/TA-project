import type React from "react"
import { type InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/utils/cn"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{leftIcon}</div>
          )}
          <input
            type={type}
            className={cn(
              "form-input",
              error && "form-input-error",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            ref={ref}
            id={inputId}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{rightIcon}</div>
          )}
        </div>
        {error && <p className="form-error">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

export default Input
