import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import { useAppDispatch } from '../../store';
import { useDistanceCalculatorSelector } from '../../store/distance-calculator';
import { calculatorTabsSelectors, updateTab } from '../../store/distance-calculator/calculatorsSlice';
import { PENALTIES } from '../../utils/gameData';
import { calcDistance, calcTravelTime } from '../../utils/math';
import { formatSeconds } from '../../utils/utilities';
import CoordinateInput from '../common/CoordinateInput';
import CustomIcon from '../common/CustomIcon';
import SimpleNumberField from '../common/SimpleNumberField';

type DistanceFormProps = {
  tabId: EntityId
};

function DistanceForm({ tabId }: DistanceFormProps) {
  const dispatch = useAppDispatch();
  const tab = useDistanceCalculatorSelector(
    (state) => calculatorTabsSelectors.selectById(state.tabs, tabId)!,
    shallowEqual,
  );

  const distance = calcDistance(tab.startingPoint, tab.endingPoint, tab.penalty);
  const time = calcTravelTime(distance, tab.speed);

  return (
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
  );
}

export default DistanceForm;
