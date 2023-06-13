import { Box, Button } from '@mui/material';
import { LeafletEvent, Marker as LeafletMarker } from 'leaflet';
import { Popup } from 'react-leaflet';

import TargetIcon from '../../../assets/target.png';
import useCustomMapStore, { ReferenceMarker as MarkerType } from '../../../hooks/useCustomMapStore';
import CoordinateInput from '../../common/coordinate-input/CoordinateInput';
import MapMarker from '../../common/map-marker/MapMarker';

type ReferenceMarkerProps = {
  referenceMarker: MarkerType
};

function ReferenceMarker({ referenceMarker }: ReferenceMarkerProps) {
  const { modifyReferenceMarker, deleteReferenceMarker } = useCustomMapStore();

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
    <MapMarker
      icon={TargetIcon}
      iconColor="#2D124E"
      iconSize={[35, 35]}
      markerProps={{
        draggable: true,
        eventHandlers: {
          drag: handleDrag,
        },
        position: referenceMarker.displayCoordinates,
      }}
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
    </MapMarker>
  );
}

export default ReferenceMarker;
