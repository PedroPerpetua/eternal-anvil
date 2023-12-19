import { CRS } from 'leaflet';
import { MapContainer } from 'react-leaflet';

import EdgesController from './EdgesController';
import MapDragController from './MapDragController';
import MouseHoverController from './MouseHoverController';
import StructuresController from './StructuresController';
import { useAppSelector } from '../../../store';
import { mapInfoSelectors } from '../../../store/battle-planner/battle-map/mapInfoSlice';
import MapImageLayer from '../../common/MapImageLayer';
import ActionBar from '../action-bar/ActionBar';
import MousePositionDisplay from '../mouse-position-display/MousePositionDisplay';

function BattleMap() {
  const image = useAppSelector(mapInfoSelectors.image);
  return (
    <MapContainer
      crs={CRS.Simple}
      center={[0, 0]}
      zoom={1}
      zoomControl={false}
      doubleClickZoom={false} // TODO: not working?
      style={{ width: '100%', height: '100%', backgroundColor: '#9e8357' }}
    >
      <MapDragController />
      <MouseHoverController />
      <MapImageLayer image={image} />
      <StructuresController />
      <EdgesController />
      <ActionBar />
      <MousePositionDisplay />
    </MapContainer>
  );
}

export default BattleMap;
