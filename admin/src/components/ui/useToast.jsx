"use client"

import { createContext, useContext, useState } from "react"

const ToastContext = createContext({
  toast: () => {},
  toasts: [],
  dismissToast: () => {},
})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, variant = "default", duration = 3000 }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant, duration }

    setToasts((prevToasts) => [...prevToasts, newToast])

    setTimeout(() => {
      dismissToast(id)
    }, duration)

    return id
  }

  const dismissToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return <ToastContext.Provider value={{ toast, toasts, dismissToast }}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export default useToast
