import { ImageOverlay, MapContainer } from 'react-leaflet';
import { CRS, latLngBounds } from 'leaflet';
import useCustomMapStore from '../../hooks/useCustomMapStore';
import MapController from './MapController';
import { Point } from '../../types';
import Marker from './Marker';


function CustomMapDisplay() {
  const { center, markers, imageInfo } = useCustomMapStore();

  if (!imageInfo) {
    return (
      <div>No map loaded</div>
    );
  }

  const bounds: [Point, Point] = [[0, 0], [imageInfo.height, imageInfo.width]];

  return (
    <MapContainer
      id="custom-map-dialog-display"
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
    </MapContainer>
  );
}

export default CustomMapDisplay;
