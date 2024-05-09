import { useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Stack, Typography } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

import CalculatorTab from './CalculatorTab';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors } from '../../store/calculators';
import { gameColors } from '../../theme';
import TealMiniIconButton from '../common/styled/TealMiniIconButton';

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
    <Box
      sx={{
        width: '300px',
        backgroundColor: 'white',
        borderRadius: '5px',
        border: '1px solid black',
        height: 'fit-content',
        alignSelf: 'center',
      }}
    >
      <Stack direction="row" sx={{ marginBottom: '-10px' }}>
        <Stack
          direction="row"
          sx={{
            flex: 1,
            overflowX: 'scroll',
            scrollBehavior: 'smooth',
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
          ref={horizontalScrollerRef}
        >
          {
            calculator.tabs.map((tabId) => (
              <CalculatorTab.Button key={tabId} tabId={tabId} />
            ))
          }
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

export default Calculator;
