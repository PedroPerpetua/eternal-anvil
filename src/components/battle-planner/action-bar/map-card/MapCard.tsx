import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';

import CustomMapDialog from './CustomMapDialog';
import MapIcon from '../../../../assets/map-icon.png';
import ActionBarButton from '../ActionBarButton';
import ActionBarCard from '../ActionBarCard';
import { TabId } from '../ActionBarContext';

const VALUE: TabId = 'map';

function MapButton() {
  return <ActionBarButton value={VALUE} iconSrc={MapIcon} tooltip="Map" />;
}

function MapCard() {
  const [openCustomMapDialog, setOpenCustomMapDialog] = useState(false);
  return (
    <ActionBarCard value={VALUE}>
      <Stack spacing={1}>
        <Typography variant="h6">
          Map Settings
        </Typography>
        <Button onClick={() => setOpenCustomMapDialog(true)}>Custom map</Button>
        <CustomMapDialog
          open={openCustomMapDialog}
          handleClose={() => setOpenCustomMapDialog(false)}
        />
      </Stack>
    </ActionBarCard>
  );
}

MapCard.Button = MapButton;

export default MapCard;
