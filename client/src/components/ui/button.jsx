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
          "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-400 premium-focus premium-btn-hover disabled:opacity-50 disabled:pointer-events-none cursor-pointer relative overflow-hidden",
          variant === "default" && "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg hover:shadow-2xl border border-slate-700/50",
          variant === "primary" && "classic-gradient text-white shadow-lg hover:shadow-2xl border border-blue-500/20",
          variant === "outline" &&
            "bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 backdrop-blur-sm",
          variant === "ghost" && "bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 backdrop-blur-sm",
          variant === "luxury" && "luxury-gradient text-white shadow-xl hover:shadow-2xl border border-purple-500/20",
          size === "default" && "h-12 px-8 py-3 text-sm",
          size === "sm" && "h-10 rounded-xl px-6 text-sm",
          size === "lg" && "h-14 px-10 text-base rounded-2xl",
          size === "icon" && "h-12 w-12 p-0",
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }