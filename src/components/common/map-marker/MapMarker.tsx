import { useEffect, useState, useMemo, PropsWithChildren } from 'react';
import { Icon } from 'leaflet';
import { Marker, MarkerProps } from 'react-leaflet';

import { tintImage } from '../../../utils/images';
import { HexColor } from '../../../utils/types';

type MapMarkerProps = PropsWithChildren<{
  icon: string,
  iconSize: [number, number]
  iconColor: HexColor,
  markerProps: Omit<MarkerProps, 'icon'>
}>;

function MapMarker({ icon, iconSize, iconColor, markerProps, children }: MapMarkerProps) {
  const [image, setImage] = useState(icon);

  const markerIcon = useMemo(
    () => new Icon({
      iconUrl: image,
      iconSize,
    }),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [image, JSON.stringify(iconSize)],
  );

  useEffect(() => {
    tintImage(icon, iconColor).then((imageUrl) => setImage(imageUrl));
  }, [icon, iconColor]);

  return (
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    <Marker {...markerProps} icon={markerIcon}>{ children }</Marker>
  );
}

export default MapMarker;
