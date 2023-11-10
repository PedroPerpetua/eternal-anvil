import {
  Box, IconButton, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import XIcon from '../../assets/x-icon.png';
import { useAppDispatch } from '../../store';
import { useDistanceCalculatorSelector } from '../../store/distance-calculator';
import {
  calculatorTabsSelectors, calculatorsSelectors, deleteTab, switchTab, updateTab,
} from '../../store/distance-calculator/calculatorsSlice';
import { PENALTIES } from '../../utils/gameData';
import { calcDistance, calcTravelTime } from '../../utils/math';
import { formatSeconds } from '../../utils/utilities';
import CoordinateInput from '../common/CoordinateInput';
import CustomIcon from '../common/CustomIcon';
import SimpleNumberField from '../common/SimpleNumberField';
import TypographyTextField from '../common/TypographyTextField';

type CalculatorTabProps = {
  tabId: EntityId,
};

function CalculatorTabButton({ tabId }: CalculatorTabProps) {
  const dispatch = useAppDispatch();

  const active = useDistanceCalculatorSelector((state) => {
    const tab = calculatorTabsSelectors.selectById(state.tabs, tabId);
    if (!tab) return false;
    const calculator = calculatorsSelectors.selectById(state.calculators, tab.calculatorId);
    if (!calculator) return false;
    return calculator.currentTab === tabId;
  });
  const calculatorId = useDistanceCalculatorSelector((state) => {
    const tab = calculatorTabsSelectors.selectById(state.tabs, tabId);
    if (!tab) return null;
    return calculatorsSelectors.selectById(state.calculators, tab.calculatorId)?.id ?? null;
  }, shallowEqual);
  const tabName = useDistanceCalculatorSelector((state) => {
    const tab = calculatorTabsSelectors.selectById(state.tabs, tabId);
    if (!tab) return null;
    return tab.name ?? '';
  });

  if (tabName === null || calculatorId === null) return null;
  return (
    <Box
      className="clickable center-content"
      onClick={() => dispatch(switchTab({ calculatorId, tabId }))}
      sx={{
        padding: '2px 10px',
        borderRight: '1px solid black',
        borderBottom: active ? undefined : '1px solid black',
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
}

function CalculatorTab({ tabId }: CalculatorTabProps) {
  const dispatch = useAppDispatch();
  const active = useDistanceCalculatorSelector((state) => {
    const tab = calculatorTabsSelectors.selectById(state.tabs, tabId);
    if (!tab) return false;
    const calculator = calculatorsSelectors.selectById(state.calculators, tab.calculatorId);
    if (!calculator) return false;
    return calculator.currentTab === tabId;
  });
  const tab = useDistanceCalculatorSelector(
    (state) => calculatorTabsSelectors.selectById(state.tabs, tabId) ?? null,
    shallowEqual,
  );
  if (!tab || !active) return null;

  const distance = calcDistance(tab.startingPoint, tab.endingPoint, tab.penalty);
  const time = calcTravelTime(distance, tab.speed);

  return (
    <Box sx={{ padding: '20px' }}>
      <Stack spacing={3}>
        <Stack alignItems="center" spacing={1}>
          <Typography>Starting point</Typography>
          <CoordinateInput
            value={tab.startingPoint}
            onChange={(p) => dispatch(updateTab({ tabId, update: { startingPoint: p } }))}
          />
        </Stack>
        <Stack alignItems="center" spacing={1}>
          <Typography>Ending point</Typography>
          <CoordinateInput
            value={tab.endingPoint}
            onChange={(p) => dispatch(updateTab({ tabId, update: { endingPoint: p } }))}
          />
        </Stack>
        <TextField
          select
          label="Mission Penalty"
          value={tab.penalty}
          onChange={(e) => dispatch(
            updateTab({ tabId, update: { penalty: Number(e.target.value) } }),
          )}
          SelectProps={{
            renderValue: (v) => {
              const penalty = Object.values(PENALTIES).find((p) => p.value === v);
              if (!penalty) return null;
              return (
                <Stack direction="row" spacing={1}>
                  <CustomIcon src={penalty.iconSrc} tintColor={penalty.iconColor} />
                  <Typography>
                    (+
                    { penalty.value }
                    )
                    { ' ' }
                    { penalty.name }
                  </Typography>
                </Stack>
              );
            },
          }}
        >
          { Object.values(PENALTIES).map((penalty) => (
            <MenuItem key={penalty.name} value={penalty.value}>
              <Stack>
                <Stack direction="row" spacing={1}>
                  <CustomIcon src={penalty.iconSrc} tintColor={penalty.iconColor} />
                  <Typography variant="subtitle1">
                    (+
                    { penalty.value }
                    )
                    { ' ' }
                    { penalty.name }
                  </Typography>
                </Stack>
                <Typography>{ penalty.description }</Typography>
              </Stack>
            </MenuItem>
          )) }

        </TextField>
        <SimpleNumberField
          value={tab.speed}
          onChange={(v) => dispatch(updateTab({ tabId, update: { speed: v } }))}
          minValue={0}
          maxValue={150}
          textFieldProps={{
            label: 'Warlord Speed',
          }}
        />
        <Stack>
          <Typography color={!Number.isFinite(distance) ? 'gray' : undefined}>
            Distance:
            { ' ' }
            { !Number.isFinite(distance) ? '∞' : distance }
          </Typography>
          <Typography color={!Number.isFinite(time) ? 'gray' : undefined}>
            Time:
            { ' ' }
            { formatSeconds(time) }
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

CalculatorTab.Button = CalculatorTabButton;

export default CalculatorTab;
