import { useSortable } from '@dnd-kit/sortable';
// eslint-disable-next-line import/no-extraneous-dependencies
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
  // False positive?
  // eslint-disable-next-line react/no-unused-prop-types
  asOverlay?: boolean,
};

function CalculatorTabButton({ tabId, asOverlay = false }: CalculatorTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tabId });

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
  const dragging = useDistanceCalculatorSelector(
    (state) => (state.draggingTab === tabId) && !asOverlay,
  );

  return (
    <Box
      ref={setNodeRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...attributes}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...listeners}
      className="clickable center-content"
      onClick={() => dispatch(switchTab({ calculatorId, tabId }))}
      sx={{
        padding: '2px 10px',
        borderRight: dragging ? undefined : '1px solid black',
        borderBottom: dragging ? undefined : `1px solid ${active ? 'transparent' : 'black'}`,
        backgroundColor: 'white',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: asOverlay ? 0.5 : undefined,
        pointerEvents: asOverlay ? 'none' : undefined,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <TypographyTextField
          value={tabName}
          valueIfEmpty="Calculator"
          onChange={(name) => dispatch(updateTab({ tabId, update: { name } }))}
          doubleClickOnly
          textFieldProps={{ inputProps: { style: { padding: '2px' } } }}
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
}

function CalculatorTab({ tabId }: CalculatorTabProps) {
  return (
    <Box sx={{ padding: '20px' }}>
      <DistanceForm tabId={tabId} />
    </Box>
  );
}

CalculatorTab.Button = CalculatorTabButton;

export default CalculatorTab;
