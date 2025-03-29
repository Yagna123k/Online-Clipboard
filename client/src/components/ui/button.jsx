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
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variant === "default" && "bg-black text-white hover:bg-black/90",
          variant === "outline" &&
            "bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800",
          variant === "ghost" && "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "icon" && "h-8 w-8 p-0",
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
