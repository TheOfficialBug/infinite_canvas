import * as React from "react"

import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-ring]",
          {
            "border-transparent bg-[--color-primary] text-[--color-primary-foreground] hover:opacity-80": variant === "default",
            "border-transparent bg-[--color-secondary] text-[--color-secondary-foreground] hover:opacity-80": variant === "secondary",
            "border-transparent bg-[--color-destructive] text-[--color-destructive-foreground] hover:opacity-80": variant === "destructive",
            "text-[--color-foreground]": variant === "outline",
            "border-transparent bg-green-500 text-white hover:bg-green-600": variant === "success",
            "border-transparent bg-yellow-500 text-white hover:bg-yellow-600": variant === "warning",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
