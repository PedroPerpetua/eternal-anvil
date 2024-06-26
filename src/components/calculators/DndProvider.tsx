/* eslint-disable max-classes-per-file */
import { useCallback } from 'react';
import type { PropsWithChildren } from 'react';
import {
  DndContext, DragOverlay, MouseSensor as LibMouseSensor, TouchSensor as LibTouchSensor,
  pointerWithin, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { Portal } from '@mui/material';

import Calculator from './Calculator';
import CalculatorTab from './CalculatorTab';
import useCalculatorsDisplayMode from './useCalculatorsDisplayMode';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors, isCalculatorId, isTabId } from '../../store/calculators';

/* https://github.com/clauderic/dnd-kit/issues/477#issuecomment-1713536492 ---------------------- */
// Block DnD event propagation if element have "data-no-dnd" attribute
function handler(element: HTMLElement | null) {
  let el = element;
  while (el) {
    if (el.dataset && el.dataset.noDnd) {
      return false;
    }
    el = el.parentElement as HTMLElement;
  }
  return true;
}
export class MouseSensor extends LibMouseSensor {
  static activators = [{
    eventName: 'onMouseDown',
    handler: ({ nativeEvent }) => handler(nativeEvent.target as HTMLElement | null),
  }] as typeof LibMouseSensor['activators'];
}

export class TouchSensor extends LibTouchSensor {
  static activators = [{
    eventName: 'onTouchStart',
    handler: ({ nativeEvent }) => handler(nativeEvent.target as HTMLElement | null),
  }] as typeof LibTouchSensor['activators'];
}
/* ---------------------------------------------------------------------------------------------- */

function DndProvider({ children }: PropsWithChildren<object>) {
  const dispatch = useAppDispatch();
  const currentDragging = useAppSelector(calculatorsSelectors.getDragging);
  const displayMode = useCalculatorsDisplayMode();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 0,
        tolerance: 0,
        delay: 350,
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
    dispatch(calculatorsActions.handleDragEnd({
      activeId: e.active.id,
      overId: e.over?.id,
      delta: [e.delta.x, e.delta.y],
    }));
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
            currentDragging && isCalculatorId(currentDragging) && displayMode !== 'free-drag' && (
              <Calculator.Overlay calculatorId={currentDragging} />
            )
          }
        </DragOverlay>
      </Portal>
    </DndContext>
  );
}

export default DndProvider;
