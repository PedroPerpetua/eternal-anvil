import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';

function useMapZoom() {
  const [zoom, setZoom] = useState(0);
  const map = useMapEvents({
    load: () => setZoom(map.getZoom()),
    zoom: () => setZoom(map.getZoom()),
  });
  return zoom;
}

export default useMapZoom;
