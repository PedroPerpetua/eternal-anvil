import { useMemo, PropsWithChildren, forwardRef } from 'react';
import { Icon, Marker as LeafletMarker } from 'leaflet';
import { Marker, MarkerProps } from 'react-leaflet';

import useTintedImage from '../../hooks/useTintedImage';

type MapMarkerProps = PropsWithChildren<{
  icon: string,
  iconSize: [number, number]
  iconColor: string,
  markerProps: Omit<MarkerProps, 'icon'>
}>;

const MapMarker = forwardRef<LeafletMarker, MapMarkerProps>((
  { icon, iconSize, iconColor, markerProps, children },
  ref,
) => {
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
    <Marker {...markerProps} icon={markerIcon} ref={ref}>
      { children }
    </Marker>
  );
});

export default MapMarker;
