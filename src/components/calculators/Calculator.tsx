import { useCallback, useEffect } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddIcon from '@mui/icons-material/Add';
import { Box, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

import CalculatorTab from './CalculatorTab';
import useCalculatorsDisplayMode from './useCalculatorsDisplayMode';
import { calculatorWidth } from './utils';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors } from '../../store/calculators';
import { gameColors } from '../../theme';
import TealMiniIconButton from '../common/styled/TealMiniIconButton';

type CalculatorProps = {
  calculatorId: EntityId
};

function CalculatorImpl({ calculatorId }: CalculatorProps) {
  const dispatch = useAppDispatch();
  const calculator = useAppSelector(
    (state) => calculatorsSelectors.getCalculator(state, calculatorId),
  );

  const { setNodeRef: setDroppableNodeRef } = useDroppable({ id: calculatorId });

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
      sx={{
        width: calculatorWidth,
        height: 'fit-content',
        backgroundColor: 'white',
        borderRadius: '5px',
        border: '1px solid black',
        alignSelf: 'center',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <Stack
        ref={setDroppableNodeRef}
        direction="row"
        sx={{ marginBottom: '-10px', overflow: 'hidden' }}
      >
        <Stack
          ref={horizontalScrollerRef}
          direction="row"
          sx={{
            flex: 1,
            overflowY: 'hidden',
            overflowX: 'scroll',
            height: '48px',
            '&::-webkit-scrollbar': {
              height: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: gameColors.goldIcon,
              border: '2px solid transparent',
              backgroundClip: 'content-box',
              borderRadius: '5px',
            },
          }}
        >
          <SortableContext items={calculator.tabs} strategy={horizontalListSortingStrategy}>
            {
              calculator.tabs.map((tabId) => (
                <CalculatorTab.Button key={tabId} tabId={tabId} />
              ))
            }
          </SortableContext>
          <Box
            sx={{
              borderBottom: '1px solid black',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TealMiniIconButton
              Icon={AddIcon}
              size={24}
              onClick={() => dispatch(calculatorsActions.createTab({ calculatorId }))}
            />
          </Box>
        </Stack>
      </Stack>
      {
        calculator.currentTab
          ? (<CalculatorTab tabId={calculator.currentTab} />)
          : (
            <Typography
              sx={{
                marginTop: '10px',
                width: '100%',
                textAlign: 'center',
                fontStyle: 'italic',
                color: 'gray',
              }}
            >
              No tab selected.
            </Typography>
          )
      }
    </Box>
  );
}

function Calculator({ calculatorId }: CalculatorProps) {
  const dispatch = useAppDispatch();
  const calculator = useAppSelector(
    (state) => calculatorsSelectors.getCalculator(state, calculatorId),
  );
  const displayMode = useCalculatorsDisplayMode();
  /**
   * Depending on the display mode, we want to use a sortable (if we're in grid mode) or a
   * draggable (if we're in free-drag) mode.
   * Here we do the separation of props based on that.
   * We have to initialized both node refs to be set even at the start.
   */
  // Process which to use - sortable or draggable
  const sortableAttrs = useSortable({ id: calculatorId, disabled: displayMode !== 'grid' });
  const draggableAttrs = useDraggable({ id: calculatorId, disabled: displayMode !== 'free-drag' });
  const currAttrs = displayMode === 'grid' ? sortableAttrs : draggableAttrs;
  const setNodeRef = (node: HTMLElement | null) => {
    sortableAttrs.setNodeRef(node);
    draggableAttrs.setNodeRef(node);
  };
  const sx: SxProps<Theme> = {
    transform: CSS.Translate.toString(currAttrs.transform),
    zIndex: calculator.zIndex,
  };
  let attributes;
  let listeners;
  if (displayMode === 'grid') {
    attributes = sortableAttrs.attributes;
    listeners = sortableAttrs.listeners;
    sx.transition = sortableAttrs.transition;
  }
  if (displayMode === 'free-drag') {
    attributes = draggableAttrs.attributes;
    listeners = draggableAttrs.listeners;
    sx.position = 'absolute';
    [sx.left, sx.top] = calculator.position;
  }

  // Handle zIndex
  const bringToTop = useCallback(() => {
    dispatch(calculatorsActions.bringCalculatorToTop({ calculatorId }));
  }, [calculatorId, dispatch]);

  useEffect(() => {
    if (currAttrs.isDragging) bringToTop();
  }, [currAttrs.isDragging, bringToTop]);

  return (
    <Box
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      id={calculatorId.toString()}
      sx={sx}
      onClick={() => bringToTop()}
    >
      <CalculatorImpl calculatorId={calculatorId} />
    </Box>
  );
}

type CalculatorOverlayProps = {
  calculatorId: EntityId
};

function CalculatorOverlay({ calculatorId }: CalculatorOverlayProps) {
  return (
    <Box sx={{ opacity: 0.9, transform: 'scale(0.9)' }}>
      <CalculatorImpl calculatorId={calculatorId} />
    </Box>
  );
}

Calculator.Overlay = CalculatorOverlay;

export default Calculator;
