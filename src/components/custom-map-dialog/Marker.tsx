import { useRef } from 'react';
import { Marker as MarkerComponent, Popup } from 'react-leaflet';
import { Marker as LeafletMarker } from 'leaflet';
import { Box, Button } from '@mui/material';
import CoordinateInput from '../coordinate-input/CoordinateInput';
import useMapImageInputStore from '../../hooks/useCustomMapStore';


type MarkerProps = {
  markerId: string
};


function Marker({ markerId }: MarkerProps) {
  const {
    getMarker,
    setMarkerDisplayPosition,
    setMarkerIntendedPosition,
    removeMarker,
  } = useMapImageInputStore();

  const marker = getMarker(markerId);
  const markerRef = useRef<LeafletMarker>(null);

  const handleDragEnd = () => {
    const currentMarker = markerRef.current;
    if (!currentMarker) return;
    const endPosition = currentMarker.getLatLng();
    setMarkerDisplayPosition(markerId, [endPosition.lng, endPosition.lat]);
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
            setValue={(point) => setMarkerIntendedPosition(markerId, point)}
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
