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
  moveImageHandler: (e: DragEndEvent) => void,
  removeImage: (id: Id) => void
};

function WarlordList({ images, moveImageHandler, removeImage }: WarlordListProps) {
  const { setNodeRef } = useDroppable({
    id: crypto.randomUUID(),
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    <DndContext onDragEnd={moveImageHandler} sensors={sensors}>
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
    </DndContext>
  );
}

export default WarlordList;
