import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Stack } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import DistanceForm from './DistanceForm';
import XIcon from '../../assets/x-icon.png';
import { useAppDispatch } from '../../store';
import { useDistanceCalculatorSelector } from '../../store/distance-calculator';
import {
  calculatorTabsSelectors, deleteTab, switchTab, tabCalculatorSelector, updateTab,
} from '../../store/distance-calculator/calculatorsSlice';
import CustomIcon from '../common/CustomIcon';
import TypographyTextField from '../common/TypographyTextField';

type CalculatorTabProps = {
  tabId: EntityId,
};

export const CalculatorTabButton = memo(({ tabId }: CalculatorTabProps) => {
  const dispatch = useAppDispatch();
  const active = useDistanceCalculatorSelector((state) => {
    const tab = calculatorTabsSelectors.selectById(state.tabs, tabId)!;
    const calculator = tabCalculatorSelector(state.calculators, tab.id)!;
    return calculator.currentTab === tabId;
  });
  const calculatorId = useDistanceCalculatorSelector((state) => {
    const tab = calculatorTabsSelectors.selectById(state.tabs, tabId)!;
    return tabCalculatorSelector(state.calculators, tab.id)!.id;
  }, shallowEqual);
  const tabName = useDistanceCalculatorSelector((state) => {
    const tab = calculatorTabsSelectors.selectById(state.tabs, tabId)!;
    return tab.name ?? '';
  });

  return (
    <Box
      className="clickable center-content"
      onClick={() => dispatch(switchTab({ calculatorId, tabId }))}
      sx={{
        padding: '2px 10px',
        backgroundColor: 'white',
        height: '100%',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <TypographyTextField
          value={tabName}
          valueIfEmpty="Calculator"
          onChange={(name) => dispatch(updateTab({ tabId, update: { name } }))}
          doubleClickOnly
          textFieldProps={{ inputProps: { style: { padding: '2px', minWidth: '100px' } } }}
          typographyProps={{ noWrap: true, width: active ? undefined : '100px', minWidth: '100px' }}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteTab(tabId));
          }}
          color="error"
          sx={{
            borderRadius: '5px',
            backgroundColor: 'red',
            height: '20px',
            width: '20px',
            border: '1px solid darkred',
            ':hover': {
              backgroundColor: 'darkred',
            },
          }}
        >
          <CustomIcon src={XIcon} tintColor="#d8bc68" size={12} />
        </IconButton>
      </Stack>
    </Box>
  );
});

export const DraggableCalculatorTabButton = memo(({ tabId }: CalculatorTabProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tabId });
  const active = useDistanceCalculatorSelector((state) => {
    const tab = calculatorTabsSelectors.selectById(state.tabs, tabId)!;
    const calculator = tabCalculatorSelector(state.calculators, tab.id)!;
    return calculator.currentTab === tabId;
  });
  const dragging = useDistanceCalculatorSelector((state) => (state.draggingTab === tabId));

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        borderRight: '1px solid black',
        borderBottom: `1px solid ${active ? 'transparent' : 'black'}`,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: dragging ? 0.5 : undefined,
        pointerEvents: dragging ? 'none' : undefined,
      }}
    >
      <CalculatorTabButton tabId={tabId} />
    </Box>
  );
});

const CalculatorTab = memo(({ tabId }: CalculatorTabProps) => (
  <Box sx={{ padding: '20px' }}>
    <DistanceForm tabId={tabId} />
  </Box>
));

export default CalculatorTab;
