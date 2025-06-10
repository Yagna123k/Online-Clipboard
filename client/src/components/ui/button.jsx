import { forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const Button = forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variant === "default" && "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl",
          variant === "outline" &&
            "bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600",
          variant === "ghost" && "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
          size === "default" && "h-11 px-6 py-2 text-sm",
          size === "sm" && "h-9 rounded-lg px-4 text-sm",
          size === "icon" && "h-9 w-9 p-0",
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }