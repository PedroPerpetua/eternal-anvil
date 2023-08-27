import ArkIcon from '../assets/ark-icon.png';
import FortIcon from '../assets/fort-icon.png';
import PortalIcon from '../assets/portal-icon.png';
import RelicIcon from '../assets/relic-icon.png';
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
  '#d9d9d8', '#9dd6b4', '#d9ba69', '#ff7a7a', '#d9d8d9', '#dddd78', '#b0b3ee', '#bff4fc',
];

export const NEUTRAL_COLOR = '#7b35a3';
