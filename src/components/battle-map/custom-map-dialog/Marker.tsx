import { useRef } from 'react';
import { Box, Button } from '@mui/material';
import { Marker as LeafletMarker } from 'leaflet';
import { Marker as MarkerComponent, Popup } from 'react-leaflet';

import useCustomMapStore, { ReferenceMarker } from '../../../hooks/useCustomMapStore';
import CoordinateInput from '../../common/coordinate-input/CoordinateInput';

type MarkerProps = {
  marker: ReferenceMarker
};

function Marker({ marker }: MarkerProps) {
  const { modifyReferenceMarker, deleteReferenceMarker } = useCustomMapStore();
  const markerRef = useRef<LeafletMarker>(null);

  const handleDrag = () => {
    const currentMarker = markerRef.current;
    if (!currentMarker) return;
    const endPosition = currentMarker.getLatLng();
    modifyReferenceMarker(marker.id, { displayCoordinates: [endPosition.lat, endPosition.lng] });
  };

  return (
    <MarkerComponent
      draggable
      ref={markerRef}
      eventHandlers={{ drag: handleDrag }}
      position={marker.displayCoordinates}
    >
      <Popup>
        <Box>
          <CoordinateInput
            label="In Game position"
            value={marker.intendedCoordinates}
            setValue={(point) => modifyReferenceMarker(marker.id, { intendedCoordinates: point })}
          />
          <Button onClick={() => deleteReferenceMarker(marker.id)}>
            Remove Marker
          </Button>
        </Box>
      </Popup>
    </MarkerComponent>
  );
}

export default Marker;
