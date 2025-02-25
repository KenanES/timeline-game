import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardContent className="p-6 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
