import { Box, Button } from '@mui/material';
import { LeafletEvent, Marker as LeafletMarker } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

import TargetIcon from './TargetIcon';
import useCustomMapStore, { ReferenceMarker as MarkerType } from '../../../hooks/useCustomMapStore';
import useRefMarkerColor from '../../../hooks/useRefMarkerColor';
import CoordinateInput from '../../common/coordinate-input/CoordinateInput';

type ReferenceMarkerProps = {
  referenceMarker: MarkerType
};

function ReferenceMarker({ referenceMarker }: ReferenceMarkerProps) {
  const { modifyReferenceMarker, deleteReferenceMarker } = useCustomMapStore();
  const markerRef = useRefMarkerColor('#2D124E');

  const handleDrag = (e: LeafletEvent) => {
    // If drag becomes too laggy, we can swap this to onDragEnd.
    const markerObj: LeafletMarker = e.target;
    const endPosition = markerObj.getLatLng();
    modifyReferenceMarker(
      referenceMarker.id,
      { displayCoordinates: [endPosition.lat, endPosition.lng] },
    );
  };

  return (
    <Marker
      draggable
      icon={TargetIcon}
      ref={markerRef}
      eventHandlers={{ drag: handleDrag }}
      position={referenceMarker.displayCoordinates}
    >
      <Popup>
        <Box>
          <CoordinateInput
            label="In Game position"
            value={referenceMarker.intendedCoordinates}
            setValue={
              (point) => modifyReferenceMarker(referenceMarker.id, { intendedCoordinates: point })
            }
          />
          <Button onClick={() => deleteReferenceMarker(referenceMarker.id)}>
            Remove Marker
          </Button>
        </Box>
      </Popup>
    </Marker>
  );
}

export default ReferenceMarker;
