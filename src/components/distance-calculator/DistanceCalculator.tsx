import {
  DndContext, DragEndEvent, DragStartEvent, MouseSensor, useSensor,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import CalculatorIcon from '@mui/icons-material/Calculate';
import { Fab } from '@mui/material';
import { shallowEqual } from 'react-redux';

import Calculator from './Calculator';
import { useAppDispatch } from '../../store';
import { useDistanceCalculatorSelector } from '../../store/distance-calculator';
import {
  calculatorsSelectors, moveCalculator, moveTab, setDraggingTab, setShow,
} from '../../store/distance-calculator/calculatorsSlice';

function DistanceCalculator() {
  const dispatch = useAppDispatch();
  const calculatorIds = useDistanceCalculatorSelector(
    (state) => calculatorsSelectors.selectIds(state.calculators),
    shallowEqual,
  );

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const handleDragStart = (e: DragStartEvent) => {
    const activeId = e.active.id.toString();
    if (activeId.startsWith('tab')) {
      dispatch(setDraggingTab(activeId));
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const activeId = e.active.id.toString();
    if (activeId.startsWith('calculator')) {
      // Dragging a calculator
      dispatch(moveCalculator({ calculatorId: activeId, delta: [e.delta.x, e.delta.y] }));
    } else if (activeId.startsWith('tab')) {
      // Dragging a tab
      dispatch(setDraggingTab(null));
      if ((e.over?.id ?? null) === null) {
        dispatch(moveTab({ tabId: activeId, calculatorId: null }));
      }
      console.log(e);
    }
  };

  return (
    <>
      <DndContext
        sensors={[mouseSensor]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        { calculatorIds.map((id) => (<Calculator key={id} id={id} />)) }
      </DndContext>
      <Fab color="primary" onClick={() => dispatch(setShow(true))}>
        <CalculatorIcon />
      </Fab>
    </>
  );
}

export default DistanceCalculator;
