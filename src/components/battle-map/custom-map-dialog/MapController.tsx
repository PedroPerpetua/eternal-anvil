import { useEffect } from 'react';
import { latLngBounds } from 'leaflet';
import { useMap } from 'react-leaflet';

import { Point } from '../../../utils/types';

type MapControllerProps = {
  center: Point;
  maxBounds: [Point, Point];
};

function MapController({ center, maxBounds }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 0);
  }, [center, map]);

  useEffect(() => {
    const bounds = latLngBounds(maxBounds);
    map.setMaxBounds(bounds);
  }, [maxBounds, map]);

  return null;
}

export default MapController;
