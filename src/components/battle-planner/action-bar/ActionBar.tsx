import { Box, ButtonGroup, Stack } from '@mui/material';
import { useMap } from 'react-leaflet';

import { ActionBarContextProvider } from './ActionBarContext';
import AddStructureCard from './AddStructureCard';
import RealmsCard from './RealmsCard';
import SettingsCard from './SettingsCard';
import useBattleMapSelector from '../../../store/battleMap';
import { disableMapEvents, enableMapEvents } from '../../../utils/leaflet';

function ActionBar() {
  const map = useMap();
  const dragging = useBattleMapSelector((state) => state.mapInfo.dragging);

  return (
    <ActionBarContextProvider>
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
                color="tabButton"
                size="large"
                sx={{ border: '1px solid black' }}
              >
                <AddStructureCard.Button />
                <RealmsCard.Button />
                <SettingsCard.Button />
              </ButtonGroup>
            </Box>
            <AddStructureCard />
            <RealmsCard />
            <SettingsCard />
          </Stack>
        </Box>
      </Box>
    </ActionBarContextProvider>
  );
}

export default ActionBar;
