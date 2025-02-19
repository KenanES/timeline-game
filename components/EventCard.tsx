import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown } from "lucide-react"

interface EventCardProps {
  event: {
    name: string
  }
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

const EventCard = ({ event, onMoveUp, onMoveDown, isFirst, isLast }: EventCardProps) => {
  return (
    <Card className="mb-2 bg-stone-200 border-stone-300 shadow">
      <CardContent className="flex items-center justify-between p-2 sm:p-4">
        <span className="font-serif text-sm sm:text-base text-stone-800 mr-2">{event.name}</span>
        <div className="flex flex-col">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
            className="text-stone-600 hover:text-stone-800 hover:bg-stone-300 p-1"
          >
            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
            className="text-stone-600 hover:text-stone-800 hover:bg-stone-300 p-1"
          >
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default EventCard

