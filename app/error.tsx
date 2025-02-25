'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardContent className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">{error.message || 'An unexpected error occurred'}</p>
        <Button
          onClick={reset}
          variant="outline"
        >
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}
