import type { ParseKeys } from 'i18next';

import AddWarlordIcon from '../../assets/penalty-icons/add-warlord-icon.png';
import ConquerIcon from '../../assets/penalty-icons/conquer-icon.png';
import CustomPenaltyIcon from '../../assets/penalty-icons/custom-icon.png';
import GTIcon from '../../assets/penalty-icons/gt-icon.png';
import RaidIcon from '../../assets/penalty-icons/raid-icon.png';
import SendOnWatchIcon from '../../assets/penalty-icons/send-on-watch-icon.png';
import theme from '../../theme';

type Penalty = {
  value: number,
  nameTKey: ParseKeys,
  descriptionTKey: ParseKeys | '',
  iconSrc: string,
  iconColor?: string
};

export const penalties: Penalty[] = [
  {
    value: 0,
    nameTKey: 'calculators.tab.distanceForm.penalties.0.name',
    descriptionTKey: 'calculators.tab.distanceForm.penalties.0.description',
    iconSrc: AddWarlordIcon,
    iconColor: theme.palette.secondary.icon,
  },
  {
    value: 5,
    nameTKey: 'calculators.tab.distanceForm.penalties.5.name',
    descriptionTKey: 'calculators.tab.distanceForm.penalties.5.description',
    iconSrc: GTIcon,
  },
  {
    value: 10,
    nameTKey: 'calculators.tab.distanceForm.penalties.10.name',
    descriptionTKey: 'calculators.tab.distanceForm.penalties.10.description',
    iconSrc: SendOnWatchIcon,
    iconColor: theme.palette.secondary.icon,
  },
  {
    value: 16,
    nameTKey: 'calculators.tab.distanceForm.penalties.16.name',
    descriptionTKey: 'calculators.tab.distanceForm.penalties.16.description',
    iconSrc: RaidIcon,
    iconColor: theme.palette.secondary.icon,
  },
  {
    value: 20,
    nameTKey: 'calculators.tab.distanceForm.penalties.20.name',
    descriptionTKey: 'calculators.tab.distanceForm.penalties.20.description',
    iconSrc: ConquerIcon,
    iconColor: theme.palette.secondary.icon,
  },
];

export const customPenalty: Penalty = {
  value: 0,
  nameTKey: 'calculators.tab.distanceForm.penalties.custom',
  descriptionTKey: '',
  iconSrc: CustomPenaltyIcon,
  iconColor: theme.palette.secondary.icon,
};

export function calculateDistance(
  x1: number | null,
  y1: number | null,
  x2: number | null,
  y2: number | null,
  extra: number | null,
) {
  if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) + (extra ?? 0);
}

export function formatDistance(distance: number | null) {
  if (distance === null) return '∞';
  return Math.round(distance * 1000) / 1000;
}

export function calculateTime(distance: number | null, speedPerHour: number | null) {
  if (distance === null || speedPerHour === null) return null;
  return (distance * 3600) / speedPerHour;
}

export function formatSeconds(seconds: number | null) {
  if (seconds === null) return '∞';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const finalSeconds = Math.floor((seconds % 3600) % 60);

  function pad(num: number, size: number) {
    let numStr = num.toString();
    while (numStr.length < size) numStr = `0${numStr}`;
    return numStr;
  }

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(finalSeconds, 2)}`;
}

export function measureTextWidth(text: string, fontDef: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;
  ctx.font = fontDef;
  const metrics = ctx.measureText(text);
  return metrics.width;
}

export function ellipsizeText(text: string, fontDef: string, maxWidth: number) {
  const textWidth = measureTextWidth(text, fontDef);
  if (textWidth <= maxWidth) return text;
  for (let i = text.length - 1; i >= 0; i -= 1) {
    const newText = `${text.substring(0, i)}...`;
    const newWidth = measureTextWidth(newText, fontDef);
    if (newWidth <= maxWidth) {
      return newText;
    }
  }
  return '';
}

export const calculatorWidth = 300;

export const calculatorHeight = 417;

export const calculatorSpacing = 4;

export function calculatorGridWidth(numOfCols: number, spacingPx: number, paddingPx: number = 0) {
  return calculatorWidth * numOfCols + spacingPx * (numOfCols - 1) + paddingPx * 2;
}
