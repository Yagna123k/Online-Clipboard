import * as React from "react"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({ checked, onCheckedChange, ...props }: SwitchProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only peer"
        {...props}
      />
      <div
        className={`w-12 h-6 rounded-full transition-all duration-300 ease-in-out shadow-inner 
          ${checked ? "bg-gradient-to-r from-gray-900 to-black" : "bg-gray-300 dark:bg-gray-700"}
        `}
      >
        <div
          className={`absolute top-1 left-1 w-4.5 h-4.5 bg-white dark:bg-gray-900 rounded-full 
            shadow-md transition-all duration-300 transform 
            ${checked ? "translate-x-6 bg-gray-100 dark:bg-white" : "bg-white dark:bg-gray-800"}
          `}
        ></div>
      </div>
    </label>
  )
}
