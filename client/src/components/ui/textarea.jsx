import { forwardRef } from "react"
import { cn } from "@/lib/utils"

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 px-6 py-4 text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 premium-focus disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 resize-none backdrop-blur-sm shadow-sm hover:shadow-md",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea }