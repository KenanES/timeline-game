import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardContent className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Not Found</h2>
        <p className="text-gray-600 mb-6">Could not find requested resource</p>
        <Button asChild variant="outline">
          <Link href="/">Return Home</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
