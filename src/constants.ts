// More will be added
/* eslint import/prefer-default-export: 0 */
import { DistancePenaltyMap } from './types';


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
