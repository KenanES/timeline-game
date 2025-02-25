"use client"

import { useState, useEffect } from "react"

interface ToastProps {
  title: string
  description?: string
}

// Create a context for the toast
import { createContext, useContext } from 'react'

const ToastContext = createContext<{
  toast: ToastProps | null
  setToast: (toast: ToastProps | null) => void
} | null>(null)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastProps | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [toast])

  return (
    <ToastContext.Provider value={{ toast, setToast }} >
      {children}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold">{toast.title}</h3>
          {toast.description && <p>{toast.description}</p>}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const toast = (props: ToastProps) => {
  const context = useContext(ToastContext)
  if (context) {
    context.setToast(props)
  }
}

