import { useMemo, PropsWithChildren } from 'react';
import { Icon } from 'leaflet';
import { Marker, MarkerProps } from 'react-leaflet';

import useTintedImage from '../../hooks/useTintedImage';

type MapMarkerProps = PropsWithChildren<{
  icon: string,
  iconSize: [number, number]
  iconColor: string,
  markerProps: Omit<MarkerProps, 'icon'>
}>;

function MapMarker({ icon, iconSize, iconColor, markerProps, children }: MapMarkerProps) {
  const image = useTintedImage(icon, iconColor);

  const markerIcon = useMemo(
    () => new Icon({
      iconUrl: image,
      iconSize,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [image, JSON.stringify(iconSize)],
  );
  return (
    <Marker {...markerProps} icon={markerIcon}>{ children }</Marker>
  );
}

export default MapMarker;
