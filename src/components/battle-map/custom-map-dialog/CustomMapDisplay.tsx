import { CRS, latLngBounds } from 'leaflet';
import { ImageOverlay, MapContainer, Marker as LeafletMarker } from 'react-leaflet';

import MapController from './MapController';
import Marker from './Marker';
import useCustomMapStore from '../../../hooks/useCustomMapStore';
import { Point, Colors } from '../../../utils/types';
import { coloredMarker } from '../../../utils/utilities';

const LeafletPinIcon = coloredMarker(Colors.GOLD);

type CustomMapDisplayProps = {
  testPoint: Point
};

function CustomMapDisplay({ testPoint }: CustomMapDisplayProps) {
  const {
    center, markers, imageInfo, intendedToDisplay,
  } = useCustomMapStore();

  const testPointCoordinates = intendedToDisplay(testPoint);
  if (!imageInfo) {
    return (
      <div>No map loaded</div>
    );
  }

  const bounds: [Point, Point] = [[0, 0], [imageInfo.height, imageInfo.width]];

  return (
    <MapContainer
      id="custom-map-display"
      crs={CRS.Simple}
      zoom={1}
      zoomSnap={0.1}
      maxBoundsViscosity={1}
    >
      <MapController center={center} maxBounds={bounds} />
      <ImageOverlay url={imageInfo.url} bounds={latLngBounds(bounds)} />
      {
        [...markers.keys()].map((id) => (
          <Marker key={id} markerId={id} />
        ))
      }
      {
          Number.isFinite(testPointCoordinates[0])
          && Number.isFinite(testPointCoordinates[1])
          && (
          <LeafletMarker
            position={testPointCoordinates}
            icon={LeafletPinIcon}
          />
          )
      }
    </MapContainer>
  );
}

export default CustomMapDisplay;
