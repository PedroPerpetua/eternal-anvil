import { latLngBounds } from 'leaflet';
import { ImageOverlay, useMap } from 'react-leaflet';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { Point } from '../../../utils/types';

interface ImageMapInfo {
  width: number;
  height: number;
  url: string;
  center: Point
}

type ImageMapLayerProps = {
  image: ImageMapInfo | null
};

function ImageMapLayer({ image }: ImageMapLayerProps) {
  const map = useMap();

  useDeepCompareEffect(() => {
    if (image === null) return;
    map.setView(image.center);
  }, [map, image]);

  if (image === null) return null;

  return (
    <ImageOverlay
      url={image.url}
      bounds={latLngBounds([[0, 0], [image.height, image.width]])}
    />
  );
}

export default ImageMapLayer;
