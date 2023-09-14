import { useMemo, PropsWithChildren, forwardRef } from 'react';
import { Icon, Marker as LeafletMarker } from 'leaflet';
import { Marker, MarkerProps } from 'react-leaflet';

import useMapZoom from '../../hooks/useMapZoom';
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
  const zoom = useMapZoom();
  const image = useTintedImage(icon, iconColor);
  const markerIcon = useMemo(
    () => new Icon({
      iconUrl: image,
      iconSize: [iconSize[0] * (zoom + 1), iconSize[1] * (zoom + 1)],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [image, JSON.stringify(iconSize), zoom],
  );
  return (
    <Marker {...markerProps} icon={markerIcon} ref={ref}>
      { children }
    </Marker>
  );
});

export default MapMarker;
