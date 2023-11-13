import {
  DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MeasuringStrategy,
  MouseSensor, useSensor,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import CalculatorIcon from '@mui/icons-material/Calculate';
import { Fab } from '@mui/material';
import { shallowEqual } from 'react-redux';

import Calculator from './Calculator';
import { CalculatorTabButton } from './CalculatorTab';
import OutsideDroppablePortal from './OutsideDroppablePortal';
import useCollisionDetectionStrategy from './useCollisionDetectionStrategy';
import { useAppDispatch } from '../../store';
import { useDistanceCalculatorSelector } from '../../store/distance-calculator';
import {
  calculatorsSelectors, moveCalculator, moveTabStart, moveTabOver, moveTabEnd, setShow,
  isCalculator, isCalculatorTab,
} from '../../store/distance-calculator/calculatorsSlice';
import { Point } from '../../utils/math';

function DistanceCalculator() {
  const dispatch = useAppDispatch();
  const calculatorIds = useDistanceCalculatorSelector(
    (state) => calculatorsSelectors.selectIds(state.calculators),
    shallowEqual,
  );
  const draggingTab = useDistanceCalculatorSelector((state) => state.draggingTab);
  const show = useDistanceCalculatorSelector((state) => state.show);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const collisionDetectionStrategy = useCollisionDetectionStrategy();

  const handleDragStart = (e: DragStartEvent) => {
    const activeId = e.active.id.toString();
    if (isCalculatorTab(activeId)) dispatch(moveTabStart({ tabId: activeId }));
  };

  const handleDragOver = (e: DragOverEvent) => {
    const activeId = e.active.id.toString();
    if (isCalculator(activeId)) return;
    if (isCalculatorTab(activeId)) {
      dispatch(moveTabOver({ tabId: activeId, overId: e.over?.id ?? null }));
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const activeId = e.active.id.toString();
    const delta = [e.delta.x, e.delta.y] as Point;
    if (isCalculator(activeId)) {
      dispatch(moveCalculator({ calculatorId: activeId, delta }));
    } else if (isCalculatorTab(activeId)) {
      dispatch(moveTabEnd({ tabId: activeId, overId: e.over?.id.toString() ?? null, delta }));
    }
  };

  return (
    <>
      <DndContext
        sensors={[mouseSensor]}
        collisionDetection={collisionDetectionStrategy}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <OutsideDroppablePortal>
          { calculatorIds.map((id) => (<Calculator key={id} id={id} />)) }
          <DragOverlay zIndex={1002}>
            { draggingTab && (<CalculatorTabButton tabId={draggingTab} />) }
          </DragOverlay>
        </OutsideDroppablePortal>
      </DndContext>
      <Fab color="primary" onClick={() => dispatch(setShow(!show))}>
        <CalculatorIcon />
      </Fab>
    </>
  );
}

export default DistanceCalculator;
