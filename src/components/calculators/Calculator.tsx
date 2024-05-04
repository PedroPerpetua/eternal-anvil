import { useCallback } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

import CalculatorTab from './CalculatorTab';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors } from '../../store/calculators';
import { gameColors } from '../../theme';

type CalculatorProps = {
  calculatorId: EntityId
};

function Calculator({ calculatorId }: CalculatorProps) {
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
    <Box sx={{
      width: '300px',
      backgroundColor: 'white',
      borderRadius: '5px',
      border: '1px solid black',
    }}
    >
      <Stack direction="row" sx={{ marginBottom: '-10px' }}>
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
              backgroundColor: gameColors.goldIcon,
              border: '2px solid transparent',
              backgroundClip: 'content-box',
              borderRadius: '5px',
            },
          }}
          ref={horizontalScrollerRef}
        >
          {
            calculator.tabs.map((tabId) => (
              <CalculatorTab.Button key={tabId} tabId={tabId} />
            ))
          }
          <Box sx={{ borderBottom: '1px solid black', flex: 1, minWidth: '100px' }}>
            <Button onClick={() => dispatch(calculatorsActions.createTab({ calculatorId }))}>
              New Tab
            </Button>
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

export default Calculator;
