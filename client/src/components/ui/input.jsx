import { forwardRef } from "react"
import { cn } from "@/lib/utils"

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 px-6 py-3 text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 premium-focus disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }