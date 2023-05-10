import { HexColor } from '@hello-pangea/color-picker';
import { Icon } from 'leaflet';

import { DistancePenaltyMap, Point, StructureMap } from './types';
import ArkIcon from '../assets/ark-icon.png';
import FortIcon from '../assets/fort-icon.png';
import PortalIcon from '../assets/portal-icon.png';
import RelicIcon from '../assets/relic-icon.png';
import TowerIcon from '../assets/tower-icon.png';

export const INFINITE_CHAR = '∞';

export const EMPTY_POINT: Point = [Infinity, Infinity];

export const DISTANCE_PENALTIES: DistancePenaltyMap = {
  JOIN_FORT_RELIC: {
    shortName: 'No penalty',
    description: 'Add to mission or send to Goblin Fort or Relic',
    penalty: 0,
  },
  GOBLIN_TOWER: {
    shortName: 'Goblin Tower',
    description: 'Raid goblin tower',
    penalty: 5,
  },
  SUPPORT: {
    shortName: 'Support',
    description: 'Send to a friendly tower (support/watch)',
    penalty: 10,
  },
  RAID: {
    shortName: 'Raid',
    description: 'Raid enemy tower',
    penalty: 16,
  },
  CONQUER_DESTROY: {
    shortName: 'Conquer',
    description: 'Conquer enemy tower or destroy enemy portal',
    penalty: 20,
  },
};

export const STRUCTURES: StructureMap = {
  ARK: {
    name: 'Ark',
    icon: new Icon({ iconUrl: ArkIcon, iconSize: [52, 40] }),
  },
  TOWER: {
    name: 'Tower',
    icon: new Icon({ iconUrl: TowerIcon, iconSize: [40, 40] }),
  },
  PORTAL: {
    name: 'Portal',
    icon: new Icon({ iconUrl: PortalIcon, iconSize: [40, 40] }),
  },
  RELIC: {
    name: 'Ancient Relic',
    icon: new Icon({ iconUrl: RelicIcon, iconSize: [80, 80] }),
  },
  FORT: {
    name: 'Goblin Fort',
    icon: new Icon({ iconUrl: FortIcon, iconSize: [60, 89] }),
  },
};

export const REALM_COLORS: Array<HexColor> = [
  '#d9d9d8', '#9dd6b4', '#d9ba69', '#ff7a7a', '#d9d8d9', '#dddd78', '#b0b3ee', '#bff4fc',
];
