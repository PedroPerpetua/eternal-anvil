import {
  DndContext, useDroppable, DragEndEvent, useSensors, useSensor, PointerSensor, KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import WarlordCard from './WarlordCard';
import { Id } from '../../../utils/types';

type WarlordListProps = {
  images: { value: string, id: Id }[],
  removeImage: (id: Id) => void
};

function WarlordList({ images, removeImage }: WarlordListProps) {
  const { setNodeRef } = useDroppable({
    id: crypto.randomUUID(),
  });
  return (
    <div className="warlord-list" ref={setNodeRef}>
      <SortableContext items={images} strategy={verticalListSortingStrategy}>
        {
          images.map((imgItem) => (
            <WarlordCard
              key={imgItem.id}
              id={imgItem.id}
              image={imgItem.value}
              onDelete={() => removeImage(imgItem.id)}
            />
          ))
        }
      </SortableContext>
    </div>
  );
}

export default WarlordList;
