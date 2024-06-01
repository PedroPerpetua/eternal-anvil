import { useCallback } from 'react';
import { Stack, Typography } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import PenaltySelector from './PenaltySelector';
import { calculateDistance, calculateTime, formatDistance, formatSeconds } from './utils';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors } from '../../store/calculators';
import type { CalculatorTab } from '../../store/calculators';
import CoordinateInput from '../common/CoordinateInput';
import SimpleNumberField from '../common/SimpleNumberField';

type DistanceFormProps = {
  tabId: EntityId
};

function DistanceForm({ tabId }: DistanceFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => calculatorsSelectors.getTab(state, tabId));

  const update = useCallback((changes: Partial<Omit<CalculatorTab, 'id'>>) => {
    dispatch(calculatorsActions.updateTab({ tabId, changes }));
  }, [dispatch, tabId]);

  const distance = calculateDistance(
    tab.point1[0],
    tab.point1[1],
    tab.point2[0],
    tab.point2[1],
    tab.penalty,
  );
  const time = calculateTime(distance, tab.speed);

  return (
    <Stack spacing={3} sx={{ padding: '20px' }}>
      <Stack spacing={2}>
        <Stack alignItems="center" flexDirection="row" justifyContent="space-between">
          <Typography>{ t('calculators.tab.distanceForm.point1') }</Typography>
          <CoordinateInput value={tab.point1} onChange={(p) => update({ point1: p })} />
        </Stack>
        <Stack alignItems="center" flexDirection="row" justifyContent="space-between">
          <Typography>{ t('calculators.tab.distanceForm.point2') }</Typography>
          <CoordinateInput value={tab.point2} onChange={(p) => update({ point2: p })} />
        </Stack>
      </Stack>
      <PenaltySelector
        label={t('calculators.tab.distanceForm.penalties.label')}
        value={tab.penalty}
        onChange={(v) => update({ penalty: v })}
      />
      <SimpleNumberField
        value={tab.speed}
        onChange={(v) => update({ speed: v })}
        minValue={0}
        maxValue={350}
        textFieldProps={{ label: t('calculators.tab.distanceForm.speed') }}
      />
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color={distance !== null ? undefined : 'gray'}>
            { t('calculators.tab.distanceForm.distance') }
            :
          </Typography>
          <Typography>
            { formatDistance(distance) }
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color={time !== null ? undefined : 'gray'}>
            { t('calculators.tab.distanceForm.time') }
            :
          </Typography>
          <Typography>
            { formatSeconds(time) }
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default DistanceForm;
