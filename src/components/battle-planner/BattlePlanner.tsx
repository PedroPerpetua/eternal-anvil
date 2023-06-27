import { Box } from '@mui/material';

import ActionBar from './action-bar/ActionBar';
import BattleMap from './battle-map/BattleMap';

import './BattlePlanner.scss';

function BattlePlanner() {
  return (
    <Box id="battle-planner" className="center-content">
      <BattleMap />
      <ActionBar />
    </Box>
  );
}

export default BattlePlanner;
