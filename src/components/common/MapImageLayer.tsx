import { useEffect, useState } from 'react';
import { ImageOverlay, useMap } from 'react-leaflet';

import { readImageFromURL } from '../../utils/utilities';

type MapImageLayerProps = {
  image: string | null
};

type MapInfo = {
  src: string,
  width: number,
  height: number
};

function MapImageLayer({ image }: MapImageLayerProps) {
  const map = useMap();
  const [mapInfo, setMapInfo] = useState<MapInfo | null>(null);
  useEffect(() => {
    if (image === null) return;
    const effect = async () => {
      const { width, height } = await readImageFromURL(image);
      setMapInfo({ src: image, width, height });
      map.setView([height / 2, width / 2]);
    };
    effect();
  }, [image, map]);

  if (mapInfo === null) return null;

  return (
    <ImageOverlay url={mapInfo.src} bounds={[[0, 0], [mapInfo.width, mapInfo.height]]} />
  );
}

export default MapImageLayer;
