import { CRS } from 'leaflet';
import { MapContainer } from 'react-leaflet';

import StructureEdge from './StructureEdge';
import StructureMarker from './StructureMarker';
import useBattleMapStore from '../../../hooks/useBattleMapStore';
import ImageMapLayer from '../../common/image-map-layer/ImageMapLayer';

import './MapDisplay.scss';

function MapDisplay() {
  const { mapInfo, structures, edgesController } = useBattleMapStore();

  return (
    <MapContainer
      id="map-display"
      crs={CRS.Simple}
      zoom={1}
      center={[0, 0]}
      zoomSnap={0.1}
      maxBoundsViscosity={1}
    >
      <ImageMapLayer image={mapInfo.imageMapInfo} />
      {
        structures.map((structure, i) => (
          <StructureMarker key={structure.id} structure={structure} />
        ))
      }
      {
        edgesController.edges.map((edge) => (
          <StructureEdge edge={edge} key={edge[0] + edge[1]} />
        ))
      }
    </MapContainer>
  );
}

export default MapDisplay;
