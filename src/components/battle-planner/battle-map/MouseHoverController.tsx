import { useMemo } from 'react';
import { useMapEvent } from 'react-leaflet';
import { shallowEqual } from 'react-redux';
import { inverse } from 'transformation-matrix';

import { useAppDispatch } from '../../../store';
import useBattleMapSelector from '../../../store/battleMap';
import { setCurrentMouseHover } from '../../../store/battleMap/mapInfoSlice';
import { EMPTY_POINT, transformPoint } from '../../../utils/math';

function MouseHoverController() {
  const dispatch = useAppDispatch();
  const transformationMatrix = useBattleMapSelector(
    (state) => state.mapInfo.transformationMatrix,
    shallowEqual,
  );
  const inverseMatrix = useMemo(() => inverse(transformationMatrix), [transformationMatrix]);
  useMapEvent('mousemove', (e) => {
    const point = transformPoint(inverseMatrix, [e.latlng.lat, e.latlng.lng]);
    dispatch(setCurrentMouseHover([Math.round(point[0]), Math.round(point[1])]));
  });

  useMapEvent('mouseout', () => dispatch(setCurrentMouseHover(EMPTY_POINT)));

  return null;
}

export default MouseHoverController;
