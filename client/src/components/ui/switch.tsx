import * as React from "react"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({ checked, onCheckedChange, ...props }: SwitchProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only peer"
        {...props}
      />
      <div
        className={`w-14 h-7 rounded-full transition-all duration-500 ease-out shadow-inner border-2 group-hover:shadow-lg
          ${checked 
            ? "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 border-slate-600" 
            : "bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 border-slate-300 dark:border-slate-500"
          }
        `}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-lg transition-all duration-500 transform border-2
            ${checked 
              ? "translate-x-7 bg-white border-slate-200 shadow-slate-900/20" 
              : "bg-white dark:bg-slate-200 border-slate-100 dark:border-slate-300 shadow-slate-500/20"
            }
          `}
        >
          <div className={`absolute inset-1 rounded-full transition-all duration-300 ${
            checked ? "bg-gradient-to-br from-slate-100 to-slate-50" : "bg-gradient-to-br from-white to-slate-50"
          }`}></div>
        </div>
      </div>
    </label>
  )
}