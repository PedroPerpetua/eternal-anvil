import { useMapEvent } from 'react-leaflet';

import { useAppDispatch, useAppSelector } from '../../../store';
import { mapInfoActions, mapInfoSelectors } from '../../../store/battle-planner/battle-map/mapInfoSlice';
import { EMPTY_POINT, leafletToGame } from '../../../utils/math';

function MouseHoverController() {
  const dispatch = useAppDispatch();
  const transformationMatrix = useAppSelector(mapInfoSelectors.transformationMatrix);

  useMapEvent('mousemove', (e) => {
    dispatch(mapInfoActions.setCurrentMouseHover(
      leafletToGame(transformationMatrix, [e.latlng.lat, e.latlng.lng]),
    ));
  });

  useMapEvent('mouseout', () => dispatch(mapInfoActions.setCurrentMouseHover(EMPTY_POINT)));

  return null;
}

export default MouseHoverController;
