import { useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Button, Portal, Stack } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import CalculatorTab from './CalculatorTab';
import { useAppDispatch } from '../../store';
import { useDistanceCalculatorSelector } from '../../store/distance-calculator';
import { calculatorTabsSelectors, calculatorsSelectors, createTab } from '../../store/distance-calculator/calculatorsSlice';

type DraggableCalculatorProps = {
  id: EntityId
};

function DraggableCalculator({ id }: DraggableCalculatorProps) {
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
    const position = calculatorsSelectors.selectById(state.calculators, id)?.position;
    if (!position) return null;
    const tabs = calculatorTabsSelectors.selectAll(state.tabs)
      .filter((t) => t.calculatorId === id)
      .map((t) => t.id);
    if (tabs.length === 0) return null;
    return { position, tabs };
  }, (a, b) => {
    if (a === null && b == null) return true;
    if (a === null || b == null) return false;
    return shallowEqual(a.tabs, b.tabs) && shallowEqual(a.position, b.position);
  });

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
        <Stack direction="row">
          <Box
            ref={setActivatorNodeRef}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...attributes}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...listeners}
            className="center-content clickable"
            sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
          >
            <DragIndicatorIcon />
          </Box>
          <Stack
            direction="row"
            sx={{ flex: 1, overflowX: 'auto', scrollBehavior: 'smooth' }}
            ref={horizontalScrollerRef}
          >
            {
              calculatorData.tabs.map(
                (tabId) => <CalculatorTab.Button key={tabId} tabId={tabId} />,
              )
            }
            <Box sx={{ borderBottom: '1px solid black', flex: 1, minWidth: '100px' }}>
              <Button onClick={() => dispatch(createTab(id))}>New Tab</Button>
            </Box>
          </Stack>
        </Stack>
        { calculatorData.tabs.map((tabId) => <CalculatorTab key={tabId} tabId={tabId} />) }
      </Box>
    </Portal>
  );
}

export default DraggableCalculator;
