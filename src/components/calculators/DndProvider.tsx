import { useCallback } from 'react';
import type { PropsWithChildren } from 'react';
import {
  DndContext, DragOverlay, MouseSensor, TouchSensor, pointerWithin, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { Portal } from '@mui/material';

import Calculator from './Calculator';
import CalculatorTab from './CalculatorTab';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors, isCalculatorId, isTabId } from '../../store/calculators';

function DndProvider({ children }: PropsWithChildren<object>) {
  const dispatch = useAppDispatch();
  const currentDragging = useAppSelector(calculatorsSelectors.getDragging);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
        delay: 700,
        tolerance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
        delay: 700,
        tolerance: 0,
      },
    }),
  );

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
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      collisionDetection={pointerWithin}
    >
      { children }
      <Portal>
        <DragOverlay zIndex={9999}>
          {
            currentDragging && isTabId(currentDragging) && (
              <CalculatorTab.Overlay tabId={currentDragging} />
            )
          }
          {
            currentDragging && isCalculatorId(currentDragging) && (
              <Calculator.Overlay calculatorId={currentDragging} />
            )
          }
        </DragOverlay>
      </Portal>
    </DndContext>
  );
}

export default DndProvider;
