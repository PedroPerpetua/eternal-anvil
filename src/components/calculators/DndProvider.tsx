import { useCallback, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import {
  DndContext, DragOverlay, MouseSensor, TouchSensor, pointerWithin, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Portal } from '@mui/material';

import CalculatorTab from './CalculatorTab';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors } from '../../store/calculators';

function DndProvider({ children }: PropsWithChildren<object>) {
  const dispatch = useAppDispatch();
  const currentDragging = useAppSelector(calculatorsSelectors.getDraggingTab);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );
  const modifiers = useMemo(() => [restrictToWindowEdges], []);
  const onDragStart = useCallback((e: DragStartEvent) => {
    dispatch(calculatorsActions.handleDragStart({ activeId: e.active.id }));
  }, [dispatch]);
  const onDragOver = useCallback((e: DragOverEvent) => {
    dispatch(calculatorsActions.handleDragOver({ activeId: e.active.id, overId: e.over?.id }));
  }, [dispatch]);
  const onDragEnd = useCallback((e: DragEndEvent) => {
    dispatch(calculatorsActions.handleDragEnd({ activeId: e.active.id, overId: e.over?.id }));
  }, [dispatch]);

  return (
    <DndContext
      sensors={sensors}
      modifiers={modifiers}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      collisionDetection={pointerWithin}
    >
      { children }
      <Portal>
        <DragOverlay zIndex={9999} modifiers={modifiers}>
          { currentDragging && <CalculatorTab.Overlay tabId={currentDragging} /> }
        </DragOverlay>
      </Portal>
    </DndContext>
  );
}

export default DndProvider;
