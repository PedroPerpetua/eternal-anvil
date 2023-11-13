import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import { useMap } from 'react-leaflet';

import CustomMapDialog from './CustomMapDialog';
import MapIcon from '../../../../assets/map-icon.png';
import { ActionBarTabId } from '../../../../store/battle-planner/action-bar/currentTabSlice';
import { mapToCanvas } from '../../../../utils/leaflet';
import CustomIcon from '../../../common/CustomIcon';
import ActionBarButton from '../ActionBarButton';
import ActionBarCard from '../ActionBarCard';

const VALUE: ActionBarTabId = 'map';

function MapButton() {
  return (
    <ActionBarButton value={VALUE} tooltip="Map">
      <CustomIcon src={MapIcon} tintColor="#d8bc68" />
    </ActionBarButton>
  );
}

function MapCard() {
  const map = useMap();
  const [openCustomMapDialog, setOpenCustomMapDialog] = useState(false);

  const handleSaveAsImage = async () => {
    const canvas = await mapToCanvas(map);
    canvas.toBlob((blob) => saveAs(blob ?? '', 'battle.png'));
  };

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
        <Button onClick={handleSaveAsImage}>Save as image</Button>
      </Stack>
    </ActionBarCard>
  );
}

MapCard.Button = MapButton;

export default MapCard;
