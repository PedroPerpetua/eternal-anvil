import { useMapEvent } from 'react-leaflet';
import { shallowEqual } from 'react-redux';

import { useAppDispatch } from '../../../store';
import { useBattleMapSelector } from '../../../store/battleMap';
import { setCurrentMouseHover } from '../../../store/battleMap/mapInfoSlice';
import { EMPTY_POINT, leafletToGame } from '../../../utils/math';

function MouseHoverController() {
  const dispatch = useAppDispatch();
  const transformationMatrix = useBattleMapSelector(
    (state) => state.mapInfo.transformationMatrix,
    shallowEqual,
  );
  useMapEvent('mousemove', (e) => {
    dispatch(
      setCurrentMouseHover(leafletToGame(transformationMatrix, [e.latlng.lat, e.latlng.lng])),
    );
  });

  useMapEvent('mouseout', () => dispatch(setCurrentMouseHover(EMPTY_POINT)));

  return null;
}

export default MouseHoverController;
