import AddWarlordIcon from '../assets/add-warlord-icon.png';
import ArkIcon from '../assets/ark-icon.png';
import ConquerIcon from '../assets/conquer-icon.png';
import FortIcon from '../assets/fort-icon.png';
import OrbIcon from '../assets/orb-icon.png';
import PortalIcon from '../assets/portal-icon.png';
import RaidIcon from '../assets/raid-icon.png';
import RelicIcon from '../assets/relic-icon.png';
import SendOnWatchIcon from '../assets/send-on-watch-icon.png';
import TowerIcon from '../assets/tower-icon.png';

// Structures

export type StructureType = 'ARK' | 'TOWER' | 'PORTAL' | 'RELIC' | 'FORT';

type StructureData = {
  name: string;
  icon: string;
  size: [number, number]
};

export const STRUCTURES_DATA: Record<StructureType, StructureData> = {
  ARK: {
    name: 'Ark',
    icon: ArkIcon,
    size: [52, 40],
  },
  TOWER: {
    name: 'Tower',
    icon: TowerIcon,
    size: [40, 40],
  },
  PORTAL: {
    name: 'Portal',
    icon: PortalIcon,
    size: [40, 40],
  },
  RELIC: {
    name: 'Ancient Relic',
    icon: RelicIcon,
    size: [52, 60],
  },
  FORT: {
    name: 'Goblin Fort',
    icon: FortIcon,
    size: [40, 60],
  },
};

// Colors

export const DEFAULT_REALM_COLORS = [
  '#115aad', '#d9d9d8', '#9dd6b4', '#d9ba69', '#ff7a7a', '#dddd78', '#b0b3ee', '#bff4fc',
];

export const NEUTRAL_COLOR = '#7b35a3';

// Missions

type PenaltyType = 'P0' | 'P5' | 'P10' | 'P16' | 'P20';
type Penalty = {
  value: number,
  name: string,
  description: string,
  iconSrc: string,
  iconColor?: string
};

export const PENALTIES: Record<PenaltyType, Penalty> = {
  P0: {
    value: 0,
    name: 'No penalty',
    description: 'Add to mission / Goblin Fort / Relic',
    iconSrc: AddWarlordIcon,
    iconColor: '#d8bc68',
  },
  P5: {
    value: 5,
    name: 'Goblin Tower',
    description: 'Raid a goblin tower',
    iconSrc: OrbIcon,
  },
  P10: {
    value: 10,
    name: 'Support',
    description: 'Send on watch / support mission',
    iconSrc: SendOnWatchIcon,
    iconColor: '#d8bc68',
  },
  P16: {
    value: 16,
    name: 'Raid',
    description: 'Raid an enemy tower',
    iconSrc: RaidIcon,
    iconColor: '#d8bc68',
  },
  P20: {
    value: 20,
    name: 'Conquer',
    description: 'Conquer an enemy tower / portal',
    iconSrc: ConquerIcon,
    iconColor: '#d8bc68',
  },
};
