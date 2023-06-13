import { PropsWithChildren } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Id } from '../../../utils/types';

type DraggableProps = PropsWithChildren<{
  id: Id,
}>;

function Draggable({ id, children }: DraggableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      /* eslint-disable react/jsx-props-no-spreading */
      {...listeners}
      {...attributes}
      /* eslint-enable react/jsx-props-no-spreading */
    >
      { children }
    </div>
  );
}

export default Draggable;
