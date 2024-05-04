import EastIcon from '@mui/icons-material/East';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import WestIcon from '@mui/icons-material/West';
import { Stack, Typography } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

import {
  calculateDistance, calculateTime, customPenalty, formatDistance, formatSeconds, penalties,
} from './utils';
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
      <Typography sx={{ textAlign: 'center' }}>{ tab.name }</Typography>
      <Stack direction="row" justifyContent="space-around">
        <Typography>
          { `(${parse(tab.point1[0])} | ${parse(tab.point1[1])})` }
        </Typography>
        <Stack direction="row" spacing={-1}>
          <WestIcon />
          <HorizontalRuleIcon />
          <EastIcon />
        </Stack>
        <Typography>
          { `(${parse(tab.point2[0])} | ${parse(tab.point2[1])})` }
        </Typography>
      </Stack>
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
