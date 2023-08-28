import { Box, Typography } from '@mui/material';

import useBattleMapSelector from '../../../store/battleMap';

function MousePositionDisplay() {
  const currentPosition = useBattleMapSelector((state) => state.mapInfo.currentMouseHover);
  if (!Number.isFinite(currentPosition[0]) || !Number.isFinite(currentPosition[1])) return null;
  return (
    <Box className="leaflet-bottom leaflet-right" sx={{ padding: '15px' }}>
      <Typography variant="h6" fontWeight="bold">{ currentPosition.toString() }</Typography>
    </Box>
  );
}

export default MousePositionDisplay;
