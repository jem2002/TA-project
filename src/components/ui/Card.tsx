import type React from "react"
import type { HTMLAttributes } from "react"
import { cn } from "@/utils/cn"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated"
}

const Card: React.FC<CardProps> = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "card",
    outlined: "card border-2",
    elevated: "card shadow-lg",
  }

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  )
}

const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("p-6 pb-0", className)} {...props}>
    {children}
  </div>
)

const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
)

const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
)

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardContent.displayName = "CardContent"
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardContent, CardFooter }
