import { PropsWithChildren } from 'react';
import { useDroppable } from '@alissavrk/dnd-kit-core';
import { Portal } from '@mui/material';

import { OUTSIDE_DROPPABLE_ID } from '../../store/distance-calculator/calculatorsSlice';

type OutsideDroppablePortalProps = PropsWithChildren<object>;

function OutsideDroppablePortal({ children }: OutsideDroppablePortalProps) {
  const { setNodeRef } = useDroppable({ id: OUTSIDE_DROPPABLE_ID });
  return (
    <Portal ref={setNodeRef}>
      { children }
    </Portal>
  );
}

export default OutsideDroppablePortal;
