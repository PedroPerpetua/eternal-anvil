import { Stack, Typography } from '@mui/material';

import ActionBarButton from './ActionBarButton';
import ActionBarCard from './ActionBarCard';
import { TabId } from './ActionBarContext';
import MapIcon from '../../../assets/map-icon.png';

const VALUE: TabId = 'map';

function MapButton() {
  return <ActionBarButton value={VALUE} iconSrc={MapIcon} tooltip="Map" />;
}

function MapCard() {
  return (
    <ActionBarCard value={VALUE}>
      <Stack spacing={1}>
        <Typography variant="h6">
          Map Settings
        </Typography>
      </Stack>
    </ActionBarCard>
  );
}

MapCard.Button = MapButton;

export default MapCard;
