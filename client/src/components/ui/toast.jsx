"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { X, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext({});

const icons = {
  default: <Info className="h-5 w-5 text-blue-600" />, 
  warning: <AlertTriangle className="h-5 w-5 text-amber-600" />, 
  success: <CheckCircle className="h-5 w-5 text-emerald-600" />, 
  destructive: <X className="h-5 w-5 text-red-600" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = "default", duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant, duration }]);
    
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} remove={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const ToastItem = ({ toast, remove }) => {
  useEffect(() => {
    const timer = setTimeout(remove, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, remove]);

  return (
    <div
      className={cn(
        "relative flex w-full items-center gap-4 rounded-2xl px-6 py-4 shadow-2xl transition-all transform premium-glass border-l-4 animate-sophisticated-slide-up backdrop-blur-xl",
        toast.variant === "destructive" && "border-red-500 bg-red-50/90 text-red-900 dark:bg-red-950/90 dark:text-red-50",
        toast.variant === "success" && "border-emerald-500 bg-emerald-50/90 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-50",
        toast.variant === "warning" && "border-amber-500 bg-amber-50/90 text-amber-900 dark:bg-amber-950/90 dark:text-amber-50",
        toast.variant === "default" && "border-blue-500 bg-blue-50/90 text-blue-900 dark:bg-blue-950/90 dark:text-blue-50"
      )}
    >
      <div className="flex-shrink-0">
        {icons[toast.variant]}
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && <div className="font-semibold text-sm mb-1">{toast.title}</div>}
        {toast.description && <div className="text-sm opacity-90 leading-relaxed">{toast.description}</div>}
      </div>
      <button 
        onClick={remove} 
        className="flex-shrink-0 rounded-xl p-2 opacity-60 hover:opacity-100 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200"
      >
        <X className="h-4 w-4" />
      </button>
      {/* Elegant progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-current/20 via-current/60 to-current/20 rounded-full animate-progress" 
        style={{ 
          width: "100%", 
          animationDuration: `${toast.duration}ms`,
          background: `linear-gradient(90deg, transparent, currentColor, transparent)`
        }}
      ></div>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/* Premium animations */
<style jsx>{`
  @keyframes sophisticated-slide-in {
    0% {
      transform: translateX(100%) scale(0.95);
      opacity: 0;
    }
    100% {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }
  
  .animate-sophisticated-slide-up {
    animation: sophisticated-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes progress {
    from {
      width: 100%;
      opacity: 1;
    }
    to {
      width: 0;
      opacity: 0.3;
    }
  }

  .animate-progress {
    animation: progress linear forwards;
  }
`}</style>