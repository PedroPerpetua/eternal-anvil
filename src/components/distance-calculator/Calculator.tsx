import { useCallback, memo } from 'react';
import { useDraggable, useDroppable } from '@alissavrk/dnd-kit-core';
import { SortableContext } from '@alissavrk/dnd-kit-sortable';
import { CSS } from '@alissavrk/dnd-kit-utilities';
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
    isDragging,
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
        zIndex: 1001 + (isDragging ? 1 : 0), // over leaflet
      }}
      onClick={() => dispatch(calculatorsActions.bringCalculatorToFront({ calculatorId }))}
    >
      <Stack
        direction="row"
        sx={{ marginBottom: '-10px' }}
        {...attributes}
        {...listeners}
        ref={(node) => { setActivatorNodeRef(node); setDroppableNodeRef(node); }}
      >
        <SortableContext items={calculator.tabs}>
          <Box
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
                <DraggableCalculatorTabButton
                  key={tabId}
                  tabId={tabId}
                  disableDrag={calculator.tabs.length === 1}
                />
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
