"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { X, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext({});

const icons = {
  default: <Info className="h-5 w-5 text-blue-500" />, 
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />, 
  success: <CheckCircle className="h-5 w-5 text-green-500" />, 
  destructive: <X className="h-5 w-5 text-red-500" />,
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
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
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
        "relative flex w-full items-center gap-3 rounded-lg px-5 py-4 shadow-lg transition-all transform backdrop-blur-lg bg-opacity-90 border-l-4",
        "animate-slide-in",
        toast.variant === "destructive" && "border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-50",
        toast.variant === "success" && "border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50",
        toast.variant === "warning" && "border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-50",
        toast.variant === "default" && "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-50"
      )}
    >
      {icons[toast.variant]}
      <div className="flex-1">
        {toast.title && <div className="font-semibold">{toast.title}</div>}
        {toast.description && <div className="text-sm opacity-80">{toast.description}</div>}
      </div>
      <button onClick={remove} className="rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity">
        <X className="h-5 w-5" />
      </button>
      {/* Auto-close progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent to-current rounded-full animate-progress" style={{ width: "100%", animationDuration: `${toast.duration}ms` }}></div>
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

/* Animations */
<style jsx>{`
  @keyframes slide-in {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0;
    }
  }

  .animate-progress {
    animation: progress linear forwards;
  }
`}</style>