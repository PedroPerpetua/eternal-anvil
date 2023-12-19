import { Box, Typography } from '@mui/material';

import { useAppSelector } from '../../../store';
import { mapInfoSelectors } from '../../../store/battle-planner/battle-map/mapInfoSlice';

function MousePositionDisplay() {
  const currentPosition = useAppSelector(mapInfoSelectors.currentMouseHover);
  if (!Number.isFinite(currentPosition[0]) || !Number.isFinite(currentPosition[1])) return null;
  return (
    <Box className="leaflet-bottom leaflet-right" sx={{ padding: '15px' }}>
      <Typography variant="h6" fontWeight="bold">{ currentPosition.toString() }</Typography>
    </Box>
  );
}

export default MousePositionDisplay;
