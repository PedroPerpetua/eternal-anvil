import { useMemo, PropsWithChildren, forwardRef } from 'react';
import { Icon, Marker as LeafletMarker } from 'leaflet';
import { Marker, MarkerProps } from 'react-leaflet';

import useMapZoom from '../../hooks/useMapZoom';
import useTintedImage from '../../hooks/useTintedImage';

type MapMarkerProps = PropsWithChildren<{
  icon: string,
  iconSize: [number, number]
  iconColor: string,
  highlighted?: boolean
  markerProps: Omit<MarkerProps, 'icon'>
}>;

const MapMarker = forwardRef<LeafletMarker, MapMarkerProps>((
  { icon, iconSize, iconColor, highlighted = false, markerProps, children },
  ref,
) => {
  const zoom = useMapZoom();
  const image = useTintedImage(icon, iconColor);
  const markerIcon = useMemo(() => {
    const size: [number, number] = [iconSize[0] * (zoom + 1), iconSize[1] * (zoom + 1)];
    const shadowRatio = 0.75;
    return new Icon({
      iconUrl: image,
      iconSize: size,
      // Add a shadow so we can use it for the highlight.
      shadowUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      shadowSize: [size[0] * shadowRatio, size[1] * shadowRatio],
      shadowAnchor: [size[0] * (shadowRatio / 2), size[1] * (shadowRatio / 2)],
    });
  }, [image, iconSize, zoom]);

  // Handle highlight
  // @ts-ignore - Private method
  if (ref && ref.current && ref.current._shadow) {
    // @ts-ignore - Private method
    const shadow: HTMLImageElement = ref.current._shadow;
    if (highlighted) {
      shadow.style.boxShadow = '0 0 10px 10px Cornsilk';
      shadow.style.borderRadius = '50%';
      shadow.style.backgroundColor = 'Cornsilk';
      shadow.style.opacity = '0.5';
    } else {
      shadow.style.removeProperty('border-radius');
      shadow.style.removeProperty('box-shadow');
      shadow.style.removeProperty('background-color');
      shadow.style.removeProperty('opacity');
    }
  }

  return (
    <Marker {...markerProps} icon={markerIcon} ref={ref}>
      { children }
    </Marker>
  );
});

export default MapMarker;
