import { CRS } from 'leaflet';
import { MapContainer } from 'react-leaflet';

import MapDragController from './map-drag-controller/MapDragController';
import StructureEdge from './StructureEdge';
import StructureMarker from './StructureMarker';
import useBattleMapStore from '../../../hooks/useBattleMapStore';
import ImageMapLayer from '../../common/image-map-layer/ImageMapLayer';

import './BattleMap.scss';

function BattleMap() {
  const { mapInfo, structures, edgesController } = useBattleMapStore();

  return (
    <MapContainer
      id="battle-map"
      crs={CRS.Simple}
      zoom={1}
      center={[0, 0]}
      zoomSnap={0.1}
      maxBoundsViscosity={1}
    >
      <MapDragController />
      <ImageMapLayer image={mapInfo.imageMapInfo} />
      {
        structures.map((structure) => (
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

export default BattleMap;
