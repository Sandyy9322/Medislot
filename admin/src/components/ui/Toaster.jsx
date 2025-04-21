"use client"

import { useEffect } from "react"
import { useToast } from "./useToast"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 w-full max-w-sm p-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onDismiss }) {
  const { id, title, description, variant, duration } = toast

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <div
      className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all ${
        variant === "destructive"
          ? "border-red-500 bg-red-500 text-white"
          : "border-border bg-background text-foreground"
      }`}
    >
      <div className="flex flex-col gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <button
        onClick={onDismiss}
        className={`absolute right-2 top-2 rounded-md p-1 ${
          variant === "destructive"
            ? "text-white hover:bg-red-600"
            : "text-foreground/50 hover:bg-accent hover:text-foreground"
        }`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Toaster
