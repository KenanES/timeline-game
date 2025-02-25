import { DraggableProvided } from "react-beautiful-dnd";

interface EventCardProps {
  event: { id: number; title: string; year: number };
  index: number;
  provided: DraggableProvided;
}

export default function EventCard({ event, index, provided }: EventCardProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="flex items-center p-2 bg-white border border-stone-200 rounded shadow-sm"
    >
      <span className="w-6 h-6 flex items-center justify-center bg-[#2C3E50] text-white rounded-full mr-2">
        {index + 1}
      </span>
      <span className="text-sm">{event.title}</span>
    </div>
  );
}
