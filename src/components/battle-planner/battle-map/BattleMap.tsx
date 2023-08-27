import { CRS } from 'leaflet';
import { MapContainer } from 'react-leaflet';

import MapDragController from './MapDragController';
import StructuresController from './StructuresController';
import { useAppSelector } from '../../../store';
import MapImageLayer from '../../common/MapImageLayer';
import ActionBar from '../action-bar/ActionBar';

function BattleMap() {
  const image = useAppSelector((state) => state.mapInfo.image);
  return (
    <MapContainer
      crs={CRS.Simple}
      center={[0, 0]}
      zoom={1}
      zoomSnap={0.1}
      zoomControl={false}
      maxBoundsViscosity={1}
      style={{ width: '100%', height: '100%', backgroundColor: '#9e8357' }}
    >
      <MapImageLayer image={image} />
      <MapDragController />
      <ActionBar />
      <StructuresController />
    </MapContainer>
  );
}

export default BattleMap;
