import { useRef } from 'react';
import { Box, Button } from '@mui/material';
import { Marker as LeafletMarker } from 'leaflet';
import { Marker as MarkerComponent, Popup } from 'react-leaflet';

import useMapImageInputStore from '../../../hooks/useCustomMapStore';
import CoordinateInput from '../../common/coordinate-input/CoordinateInput';

type MarkerProps = {
  markerId: string
};

function Marker({ markerId }: MarkerProps) {
  const {
    getMarker,
    setMarkerDisplayCoordinates,
    setMarkerIntendedCoordinates,
    removeMarker,
  } = useMapImageInputStore();

  const marker = getMarker(markerId);
  const markerRef = useRef<LeafletMarker>(null);

  const handleDragEnd = () => {
    const currentMarker = markerRef.current;
    if (!currentMarker) return;
    const endPosition = currentMarker.getLatLng();
    setMarkerDisplayCoordinates(markerId, [endPosition.lat, endPosition.lng]);
  };

  if (!marker) {
    return null;
  }

  return (
    <MarkerComponent
      draggable
      ref={markerRef}
      eventHandlers={{ dragend: handleDragEnd }}
      position={marker.displayCoordinates}
    >
      <Popup>
        <Box>
          <CoordinateInput
            label="In Game position"
            value={marker.intendedCoordinates}
            setValue={(point) => setMarkerIntendedCoordinates(markerId, point)}
          />
          <Button onClick={() => removeMarker(markerId)}>
            Remove Marker
          </Button>
        </Box>
      </Popup>
    </MarkerComponent>
  );
}

export default Marker;
