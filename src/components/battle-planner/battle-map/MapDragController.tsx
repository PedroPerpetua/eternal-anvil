import { useMapEvent } from 'react-leaflet';

import { useAppDispatch } from '../../../store';
import { mapInfoActions } from '../../../store/battle-planner/battle-map/mapInfoSlice';

function MapDragController() {
  const dispatch = useAppDispatch();
  useMapEvent('dragstart', () => dispatch(mapInfoActions.setDragging(true)));
  useMapEvent('dragend', () => dispatch(mapInfoActions.setDragging(false)));
  return null;
}

export default MapDragController;
