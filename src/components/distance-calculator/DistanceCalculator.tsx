import { DndContext } from '@dnd-kit/core';
import CalculatorIcon from '@mui/icons-material/Calculate';
import { Fab } from '@mui/material';
import { shallowEqual } from 'react-redux';

import DraggableCalculator from './DraggableCalculator';
import { useAppDispatch } from '../../store';
import { useDistanceCalculatorSelector } from '../../store/distance-calculator';
import { calculatorsSelectors, moveCalculator, setShow } from '../../store/distance-calculator/calculatorsSlice';

function DistanceCalculator() {
  const dispatch = useAppDispatch();
  const calculatorIds = useDistanceCalculatorSelector(
    (state) => calculatorsSelectors.selectIds(state.calculators),
    shallowEqual,
  );
  return (
    <>
      <DndContext
        onDragEnd={(ev) => dispatch(moveCalculator({
          calculatorId: ev.active.id, delta: [ev.delta.x, ev.delta.y],
        }))}
      >
        { calculatorIds.map((id) => (<DraggableCalculator key={id} id={id} />)) }
      </DndContext>
      <Fab color="primary" onClick={() => dispatch(setShow(true))}>
        <CalculatorIcon />
      </Fab>
    </>
  );
}

export default DistanceCalculator;
