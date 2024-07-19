import { Box, Stack, Typography } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import {
  calculateDistance, calculateTime, customPenalty, formatDistance, formatSeconds, penalties,
} from './utils';
import DistanceIcon from '../../assets/distance-icon.png';
import { useAppSelector } from '../../store';
import { calculatorsSelectors } from '../../store/calculators';
import CustomIcon from '../common/CustomIcon';

function parse(n: number | null) {
  if (n === null) return '?';
  return n.toString();
}

type MiniDisplayProps = {
  tabId: EntityId,
};

function MiniDisplay({ tabId }: MiniDisplayProps) {
  const { t } = useTranslation();
  const tab = useAppSelector((state) => calculatorsSelectors.getTab(state, tabId));
  const penalty = penalties.find((p) => p.value === tab.penalty) ?? customPenalty;

  const distance = calculateDistance(
    tab.point1[0],
    tab.point1[1],
    tab.point2[0],
    tab.point2[1],
    tab.penalty,
  );
  const time = calculateTime(distance, tab.speed);

  return (
    <Stack spacing={1} sx={{ padding: '20px', paddingTop: '10px' }}>
      { /* Required wrapper to set the margin on the child element */ }
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-evenly" marginY="-10px">
          <Typography>
            { `(${parse(tab.point1[0])} | ${parse(tab.point1[1])})` }
          </Typography>
          <CustomIcon src={DistanceIcon} size={[48, 24]} />
          <Typography>
            { `(${parse(tab.point2[0])} | ${parse(tab.point2[1])})` }
          </Typography>
        </Stack>
      </Box>
      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
        {
          distance !== null && (
            <CustomIcon src={penalty.iconSrc} sx={{ color: penalty.iconColor }} />
          )
        }
        <Typography sx={{ textAlign: 'center' }}>
          {
            distance === null
              ? t('calculators.tab.minified.distance_unknown')
              : t('calculators.tab.minified.distance', { distance: formatDistance(distance) })
          }
        </Typography>
      </Stack>
      <Typography sx={{ textAlign: 'center' }}>
        {
          time === null
            ? t('calculators.tab.minified.time_unknown')
            : t('calculators.tab.minified.time', {
              time: formatSeconds(time),
              speed: parse(tab.speed),
            })
        }
      </Typography>
    </Stack>
  );
}

export default MiniDisplay;
