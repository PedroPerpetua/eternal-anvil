import { useMemo } from 'react';
import { useMapEvent } from 'react-leaflet';
import { inverse } from 'transformation-matrix';

import { useAppDispatch, useAppSelector } from '../../../store';
import { setCurrentMouseHover } from '../../../store/mapInfoSlice';
import { EMPTY_POINT, transformPoint } from '../../../utils/math';

function MouseHoverController() {
  const dispatch = useAppDispatch();
  const transformationMatrix = useAppSelector((state) => state.mapInfo.transformationMatrix);
  const inverseMatrix = useMemo(() => inverse(transformationMatrix), [transformationMatrix]);

  useMapEvent('mousemove', (e) => {
    const point = transformPoint(inverseMatrix, [e.latlng.lat, e.latlng.lng]);
    dispatch(setCurrentMouseHover([Math.round(point[0]), Math.round(point[1])]));
  });

  useMapEvent('mouseout', () => dispatch(setCurrentMouseHover(EMPTY_POINT)));

  return null;
}

export default MouseHoverController;
