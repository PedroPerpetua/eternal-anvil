import { Box, Stack, Typography } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

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
    <Stack spacing={1} sx={{ padding: '20px' }}>
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
        <CustomIcon src={penalty.iconSrc} tintColor={penalty.iconColor} />
        <Typography sx={{ textAlign: 'center' }}>
          { distance === null ? 'Unknown distance' : `${formatDistance(distance)} units` }
        </Typography>
      </Stack>
      {
        time && (
        <Typography sx={{ textAlign: 'center' }}>
          { `${formatSeconds(time)} (@ ${parse(tab.speed)} speed)` }
        </Typography>
        )
      }
    </Stack>
  );
}

export default MiniDisplay;
