import { useCallback, useEffect, useState } from 'react';
import { Image, ImageKind, Stack } from 'image-js';
import { Icon } from 'leaflet';
import { Marker, MarkerProps } from 'react-leaflet';

import { hexToRGB } from '../../../utils/cssTintFilter';
import { HexColor } from '../../../utils/types';

type MapMarkerProps = {
  icon: string,
  iconSize: [number, number]
  iconColor: HexColor,
  markerProps: Omit<MarkerProps, 'icon'>
};

function MapMarker({ icon, iconSize, iconColor, markerProps }: MapMarkerProps) {
  const [image, setImage] = useState(icon);

  const generateIcon = useCallback(() => new Icon({
    iconUrl: image,
    iconSize,
  }), [image, iconSize]);

  useEffect(() => {
    const effect = async () => {
      const [red, green, blue] = hexToRGB(iconColor);
      const originalImage = await Image.load(icon);
      const pixelCount = originalImage.width * originalImage.height;
      const pixelBitSize = 4; // RGBA;
      const colorArray = new Uint8Array(originalImage.width * originalImage.height * pixelBitSize);
      for (let i = 0; i < pixelCount; i += 1) {
        colorArray[i * pixelBitSize] = red;
        colorArray[i * pixelBitSize + 1] = green;
        colorArray[i * pixelBitSize + 2] = blue;
        colorArray[i * pixelBitSize + 3] = 255;
      }
      const colorOverlay = new Image({
        width: originalImage.width,
        height: originalImage.height,
        kind: 'RGBA' as ImageKind,
        data: colorArray,
      });
      const stack = new Stack([originalImage, colorOverlay]);
      const processedImage = stack.getMinImage();
      console.log('RGB', red, green, blue);
      console.log('OVERLAY', colorOverlay.toDataURL());
      console.log('FINAL', processedImage.toDataURL());
      setImage(processedImage.toDataURL());
    };
    effect();
  }, [icon, iconColor]);

  return (
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    <Marker {...markerProps} icon={generateIcon()} />
  );
}

export default MapMarker;
