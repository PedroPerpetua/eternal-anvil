import { useCallback, memo } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Button, Stack } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

import CalculatorTab, { DraggableCalculatorTabButton } from './CalculatorTab';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsSelectors, calculatorsActions } from '../../store/distance-calculator/calculatorsSlice';

type CalculatorProps = {
  calculatorId: EntityId
};

const Calculator = memo(({ calculatorId }: CalculatorProps) => {
  const {
    attributes,
    listeners,
    transform,
    setNodeRef,
    setActivatorNodeRef,
  } = useDraggable({ id: calculatorId });
  const { setNodeRef: setDroppableNodeRef } = useDroppable({ id: calculatorId });

  const dispatch = useAppDispatch();
  const calculator = useAppSelector(
    (state) => calculatorsSelectors.getCalculator(state, calculatorId),
  );

  const horizontalScrollerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      node.scrollTo({ left: node.scrollLeft + e.deltaY, behavior: 'smooth' });
    };
    node.addEventListener('wheel', onWheel, { passive: false });
  }, []);

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: 'absolute',
        top: calculator.position[1],
        left: calculator.position[0],
        transform: CSS.Translate.toString(transform),
        backgroundColor: 'white',
        borderRadius: '5px',
        padding: 0,
        width: '300px',
        border: '1px solid black',
        zIndex: 1001, // over leaflet
      }}
    >
      <Stack direction="row" sx={{ marginBottom: '-10px' }} ref={setDroppableNodeRef}>
        <SortableContext items={calculator.tabs}>
          <Box
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className="center-content clickable"
            sx={{
              borderBottom: '1px solid black',
              borderRight: '1px solid black',
              marginBottom: '10px',
            }}
          >
            <DragIndicatorIcon />
          </Box>
          <Stack
            direction="row"
            sx={{
              flex: 1,
              overflowX: 'scroll',
              scrollBehavior: 'smooth',
              '&::-webkit-scrollbar': {
                height: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#d8bc68',
                border: '2px solid transparent',
                backgroundClip: 'content-box',
                borderRadius: '5px',
              },
            }}
            ref={horizontalScrollerRef}
          >
            {
              calculator.tabs.map((tabId) => (
                <DraggableCalculatorTabButton key={tabId} tabId={tabId} />
              ))
            }
            <Box sx={{ borderBottom: '1px solid black', flex: 1, minWidth: '100px' }}>
              <Button onClick={() => dispatch(calculatorsActions.createTab({ calculatorId }))}>
                New Tab
              </Button>
            </Box>
          </Stack>
        </SortableContext>
      </Stack>
      { calculator.currentTab && <CalculatorTab tabId={calculator.currentTab} /> }
    </Box>
  );
});

export default Calculator;
