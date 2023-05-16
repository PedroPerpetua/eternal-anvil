import { useCallback } from 'react';
import { Marker as LeafletMarker } from 'leaflet';

import cssTintFilter from '../utils/cssTintFilter';
import { HexColor } from '../utils/types';

function useRefMarkerColor(color: HexColor) {
  return useCallback((node: LeafletMarker | null) => {
    if (node === null) return;
    node.on('add', () => {
      const element = node.getElement();
      if (!element) return;
      element.style.filter = cssTintFilter(color, 100);
    });
  }, [color]);
}

export default useRefMarkerColor;
