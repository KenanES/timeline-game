"use client"

import { useState, useEffect } from "react"

interface ToastProps {
  title: string
  description?: string
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastProps | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [toast])

  return { toast, setToast }
}

export const toast = (props: ToastProps) => {
  const { setToast } = useToast()
  setToast(props)
}

