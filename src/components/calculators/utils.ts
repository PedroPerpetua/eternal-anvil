import AddWarlordIcon from '../../assets/penalty-icons/add-warlord-icon.png';
import ConquerIcon from '../../assets/penalty-icons/conquer-icon.png';
import CustomPenaltyIcon from '../../assets/penalty-icons/custom-icon.png';
import GTIcon from '../../assets/penalty-icons/gt-icon.png';
import RaidIcon from '../../assets/penalty-icons/raid-icon.png';
import SendOnWatchIcon from '../../assets/penalty-icons/send-on-watch-icon.png';
import { gameColors } from '../../theme';

type Penalty = {
  value: number,
  name: string,
  description: string,
  iconSrc: string,
  iconColor?: string
};

export const penalties: Penalty[] = [
  {
    value: 0,
    name: 'No penalty',
    description: 'Add to mission / Goblin Fort / Relic',
    iconSrc: AddWarlordIcon,
    iconColor: gameColors.goldIcon,
  },
  {
    value: 5,
    name: 'Goblin Tower',
    description: 'Raid a goblin tower',
    iconSrc: GTIcon,
  },
  {
    value: 10,
    name: 'Support',
    description: 'Send on watch / support mission',
    iconSrc: SendOnWatchIcon,
    iconColor: gameColors.goldIcon,
  },
  {
    value: 16,
    name: 'Raid',
    description: 'Raid an enemy tower',
    iconSrc: RaidIcon,
    iconColor: gameColors.goldIcon,
  },
  {
    value: 20,
    name: 'Conquer',
    description: 'Conquer an enemy tower / portal',
    iconSrc: ConquerIcon,
    iconColor: gameColors.goldIcon,
  },
];

export const customPenalty: Penalty = {
  value: 0,
  name: 'Custom Penalty',
  description: '',
  iconSrc: CustomPenaltyIcon,
  iconColor: gameColors.goldIcon,
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
  return distance.toFixed(3);
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
