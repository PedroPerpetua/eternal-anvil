import { useMemo, PropsWithChildren } from 'react';
import { Icon } from 'leaflet';
import { Marker, MarkerProps } from 'react-leaflet';

import { HexColor } from '../../../utils/types';
import useTintedImage from '../../battle-planner/hooks/useTintedImage';

type MapMarkerProps = PropsWithChildren<{
  icon: string,
  iconSize: [number, number]
  iconColor: HexColor,
  markerProps: Omit<MarkerProps, 'icon'>
}>;

function MapMarker({ icon, iconSize, iconColor, markerProps, children }: MapMarkerProps) {
  const image = useTintedImage(icon, iconColor);

  const markerIcon = useMemo(
    () => new Icon({
      iconUrl: image,
      iconSize,
    }),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [image, JSON.stringify(iconSize)],
  );
  return (
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    <Marker {...markerProps} icon={markerIcon}>{ children }</Marker>
  );
}

export default MapMarker;
