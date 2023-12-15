import {
  DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MeasuringStrategy,
  MouseSensor, useSensor,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import CalculatorIcon from '@mui/icons-material/Calculate';
import { Fab } from '@mui/material';

import Calculator from './Calculator';
import { CalculatorTabButton } from './CalculatorTab';
import OutsideDroppablePortal from './OutsideDroppablePortal';
import useCollisionDetectionStrategy from './useCollisionDetectionStrategy';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsSelectors, calculatorsActions, isCalculator, isCalculatorTab } from '../../store/distance-calculator/calculatorsSlice';
import { Point } from '../../utils/math';

function DistanceCalculator() {
  const dispatch = useAppDispatch();
  const calculatorIds = useAppSelector(calculatorsSelectors.getCalculatorIds);
  const draggingTab = useAppSelector(calculatorsSelectors.draggingTab);
  const show = useAppSelector(calculatorsSelectors.show);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const collisionDetectionStrategy = useCollisionDetectionStrategy();

  const handleDragStart = (e: DragStartEvent) => {
    const activeId = e.active.id.toString();
    if (isCalculatorTab(activeId)) dispatch(calculatorsActions.moveTabStart({ tabId: activeId }));
  };

  const handleDragOver = (e: DragOverEvent) => {
    const activeId = e.active.id.toString();
    if (isCalculator(activeId)) return;
    if (isCalculatorTab(activeId)) {
      dispatch(calculatorsActions.moveTabOver({ tabId: activeId, overId: e.over?.id ?? null }));
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const activeId = e.active.id.toString();
    const delta = [e.delta.x, e.delta.y] as Point;
    if (isCalculator(activeId)) {
      dispatch(calculatorsActions.moveCalculator({ calculatorId: activeId, delta }));
    } else if (isCalculatorTab(activeId)) {
      dispatch(calculatorsActions.moveTabEnd(
        { tabId: activeId, overId: e.over?.id.toString() ?? null, delta },
      ));
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
          { calculatorIds.map((id) => (<Calculator key={id} calculatorId={id} />)) }
          <DragOverlay zIndex={1002}>
            { draggingTab && (<CalculatorTabButton tabId={draggingTab} />) }
          </DragOverlay>
        </OutsideDroppablePortal>
      </DndContext>
      <Fab color="primary" onClick={() => dispatch(calculatorsActions.setShow(!show))}>
        <CalculatorIcon />
      </Fab>
    </>
  );
}

export default DistanceCalculator;
