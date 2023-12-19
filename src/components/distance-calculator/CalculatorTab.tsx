import { memo } from 'react';
import { useSortable } from '@alissavrk/dnd-kit-sortable';
import { CSS } from '@alissavrk/dnd-kit-utilities';
import { Box, IconButton, Stack } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';

import DistanceForm from './DistanceForm';
import XIcon from '../../assets/x-icon.png';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsSelectors, calculatorsActions, DEFAULT_TAB_NAME } from '../../store/distance-calculator/calculatorsSlice';
import CustomIcon from '../common/CustomIcon';
import TypographyTextField from '../common/TypographyTextField';

type CalculatorTabProps = {
  tabId: EntityId,
};

export const CalculatorTabButton = memo(({ tabId }: CalculatorTabProps) => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => calculatorsSelectors.tabIsActive(state, tabId));
  const tab = useAppSelector((state) => calculatorsSelectors.getTab(state, tabId));
  return (
    <Box
      className="clickable center-content"
      onClick={() => dispatch(calculatorsActions.switchTab({ tabId }))}
      sx={{
        padding: '2px 10px',
        backgroundColor: 'white',
        height: '100%',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <TypographyTextField
          value={tab.name}
          valueIfEmpty={DEFAULT_TAB_NAME}
          onChange={(name) => dispatch(calculatorsActions.updateTab({ tabId, update: { name } }))}
          doubleClickOnly
          textFieldProps={{ inputProps: { style: { padding: '2px', minWidth: '100px' } } }}
          typographyProps={{ noWrap: true, width: active ? undefined : '100px', minWidth: '100px' }}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            dispatch(calculatorsActions.deleteTab({ tabId }));
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

type DraggableCalculatorTabButtonProps = CalculatorTabProps & {
  disableDrag: boolean
};

export const DraggableCalculatorTabButton = memo((
  { tabId, disableDrag }: DraggableCalculatorTabButtonProps,
) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    // TODO: there's a bug with the disabled here; it doesn't allow us to drop into other
    // containers if it's just the one tab
  } = useSortable({ id: tabId, disabled: disableDrag, resizeObserverConfig: {} });
  const active = useAppSelector((state) => calculatorsSelectors.tabIsActive(state, tabId));
  const draggingTab = useAppSelector(calculatorsSelectors.draggingTab);
  const dragging = draggingTab === tabId;

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
