import { Box, ButtonGroup, Stack, ThemeProvider } from '@mui/material';
import { useMap } from 'react-leaflet';

import actionBarTheme from './actionBarTheme';
import AddStructureCard from './add-structure-card/AddStructureCard';
import MapCard from './map-card/MapCard';
import RealmsCard from './realms-card/RealmsCard';
import { useBattleMapSelector } from '../../../store/battle-planner/battle-map';
import { disableMapEvents, enableMapEvents } from '../../../utils/leaflet';

function ActionBar() {
  const map = useMap();
  const dragging = useBattleMapSelector((state) => state.mapInfo.dragging);

  return (
    <ThemeProvider theme={actionBarTheme}>
      <Box className="leaflet-top leaflet-left" sx={{ width: '20%' }}>
        <Box
          className="leaflet-control leaflet-bar"
          sx={{
            opacity: dragging ? '25%' : undefined,
            pointerEvents: dragging ? 'none' : undefined,
            border: 'none !important',
            width: '100%',
          }}
          onMouseOver={() => { if (!dragging) disableMapEvents(map); }}
          onMouseOut={() => { if (!dragging) enableMapEvents(map); }}
        >
          <Stack direction="row" spacing={2}>
            <Box>
              <ButtonGroup
                disableElevation
                variant="text"
                orientation="vertical"
                size="large"
                sx={{
                  border: '1px solid black',
                  '.MuiButtonGroup-grouped:not(:last-of-type)': {
                    borderColor: '#023027',
                  },
                }}
              >
                <AddStructureCard.Button />
                <RealmsCard.Button />
                <MapCard.Button />
              </ButtonGroup>
            </Box>
            <AddStructureCard />
            <RealmsCard />
            <MapCard />
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default ActionBar;
