import { useCallback } from 'react';
import { DragOverlay, useDraggable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Button, Portal, Stack } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import CalculatorTab from './CalculatorTab';
import { useAppDispatch } from '../../store';
import { useDistanceCalculatorSelector } from '../../store/distance-calculator';
import { calculatorsSelectors, createTab } from '../../store/distance-calculator/calculatorsSlice';

type CalculatorProps = {
  id: EntityId
};

function Calculator({ id }: CalculatorProps) {
  const {
    attributes,
    listeners,
    transform,
    setNodeRef,
    setActivatorNodeRef,
  } = useDraggable({ id });

  const dispatch = useAppDispatch();
  const calculatorData = useDistanceCalculatorSelector((state) => {
    if (!state.show) return null;
    const calculator = calculatorsSelectors.selectById(state.calculators, id);
    if (!calculator) return null;
    return {
      position: calculator.position,
      tabs: calculator.tabs,
      currentTab: calculator.currentTab,
    };
  }, (a, b) => {
    if (a === null && b == null) return true;
    if (a === null || b == null) return false;
    return (
      shallowEqual(a.tabs, b.tabs)
      && shallowEqual(a.position, b.position)
      && shallowEqual(a.currentTab, b.currentTab)
    );
  });
  const draggingTab = useDistanceCalculatorSelector((state) => state.draggingTab);

  const horizontalScrollerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // eslint-disable-next-line no-param-reassign
      node.scrollTo({ left: node.scrollLeft + e.deltaY, behavior: 'smooth' });
    };
    node.addEventListener('wheel', onWheel, { passive: false });
  }, []);

  if (!calculatorData) return null;
  return (
    <Portal>
      <Box
        ref={setNodeRef}
        sx={{
          position: 'absolute',
          top: calculatorData.position[1],
          left: calculatorData.position[0],
          transform: CSS.Translate.toString(transform),
          zIndex: 1000,
          backgroundColor: 'white',
          borderRadius: '5px',
          padding: 0,
          width: '300px',
          border: '1px solid black',
        }}
      >
        <SortableContext items={calculatorData.tabs}>
          <Stack direction="row" sx={{ marginBottom: '-10px' }}>
            <Box
              ref={setActivatorNodeRef}
            // eslint-disable-next-line react/jsx-props-no-spreading
              {...attributes}
            // eslint-disable-next-line react/jsx-props-no-spreading
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
              calculatorData.tabs.map((tabId) => (
                <CalculatorTab.Button key={tabId} tabId={tabId} asOverlay={draggingTab === tabId} />
              ))
            }
              <Box sx={{ borderBottom: '1px solid black', flex: 1, minWidth: '100px' }}>
                <Button onClick={() => dispatch(createTab(id))}>New Tab</Button>
              </Box>
            </Stack>
          </Stack>
        </SortableContext>
        {
          draggingTab && (
            <DragOverlay>
              <CalculatorTab.Button tabId={draggingTab} />
            </DragOverlay>
          )
        }
        { calculatorData.currentTab && <CalculatorTab tabId={calculatorData.currentTab} /> }
      </Box>
    </Portal>
  );
}

export default Calculator;
