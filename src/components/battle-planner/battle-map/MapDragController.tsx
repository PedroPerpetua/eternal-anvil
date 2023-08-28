import { useMapEvent } from 'react-leaflet';

import { useAppDispatch } from '../../../store';
import { setDragging } from '../../../store/battleMap/mapInfoSlice';

function MapDragController() {
  const dispatch = useAppDispatch();
  useMapEvent('dragstart', () => dispatch(setDragging(true)));
  useMapEvent('dragend', () => dispatch(setDragging(false)));
  return null;
}

export default MapDragController;
