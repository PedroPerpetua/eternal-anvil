import { useCallback } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

import CalculatorForm from './CalculatorForm';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors } from '../../store/calculators';
import type { CalculatorTab } from '../../store/calculators';
import { gameColors } from '../../theme';
import DeleteButton from '../common/styled/DeleteButton';
import TypographyTextField from '../common/TypographyTextField';

type TabButtonProps = {
  tabId: EntityId,
};

function TabButton({ tabId }: TabButtonProps) {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => calculatorsSelectors.getTab(state, tabId));
  const active = useAppSelector((state) => calculatorsSelectors.getTabActive(state, tabId));

  const update = useCallback((changes: Partial<Omit<CalculatorTab, 'id'>>) => {
    dispatch(calculatorsActions.updateTab({ tabId, changes }));
  }, [dispatch, tabId]);

  return (
    <Box
      className="clickable center-content"
      sx={{
        padding: '2px 10px',
        borderRight: '1px solid black',
        borderBottom: `1px solid ${active ? 'transparent' : 'black'}`,
      }}
      onClick={() => dispatch(calculatorsActions.selectTab({ tabId }))}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <TypographyTextField
          value={tab.name}
          onChange={(name) => update({ name })}
          valueIfEmpty="Calculator"
          doubleClickOnly
          textFieldProps={{ inputProps: { style: { padding: '2px', minWidth: '100px' } } }}
          typographyProps={{ noWrap: true, width: active ? undefined : '100px', minWidth: '100px' }}
        />
        <DeleteButton onClick={(e) => {
          e.stopPropagation();
          dispatch(calculatorsActions.deleteTab({ tabId }));
        }}
        />
      </Stack>
    </Box>
  );
}

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
          <TabButton key={tabId} tabId={tabId} />
        ))
      }
        <Box sx={{ borderBottom: '1px solid black', flex: 1, minWidth: '100px' }}>
          <Button onClick={() => dispatch(calculatorsActions.createTab({ calculatorId }))}>
            New Tab
          </Button>
        </Box>
      </Stack>
      {
        calculator.currentTab
          ? (<CalculatorForm tabId={calculator.currentTab} />)
          : (<Typography>No tab selected</Typography>)
      }
    </Box>
  );
}

export default Calculator;
