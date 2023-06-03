import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

import Draggable from './Draggable';
import WarlordCard from './WarlordCard';
import { SortableItem } from '../../../hooks/useSortableContext';
import { Id } from '../../../utils/types';

type WarlordListProps = {
  containerId: string,
  images: SortableItem<string>[],
  removeImage: (id: Id) => void,
  activeId?: Id,
};

function WarlordList({ containerId, images, removeImage, activeId }: WarlordListProps) {
  const { setNodeRef } = useDroppable({ id: containerId });

  return (
    <div className="warlord-list" ref={setNodeRef}>
      <SortableContext items={images}>
        {
          images.map((imgItem) => (
            <Draggable key={imgItem.id} id={imgItem.id}>
              <WarlordCard
                image={imgItem.value}
                onDelete={() => removeImage(imgItem.id)}
                selected={activeId === imgItem.id}
              />
            </Draggable>
          ))
        }
      </SortableContext>
    </div>
  );
}

export default WarlordList;
