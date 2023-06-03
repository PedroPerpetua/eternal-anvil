import { useEffect } from 'react';
import { CRS, LatLngBounds, latLngBounds } from 'leaflet';
import { MapContainer, Marker, useMap } from 'react-leaflet';

import ReferenceMarker from './ReferenceMarker';
import TargetIcon from './TargetIcon';
import useCustomMapStore from '../../../hooks/useCustomMapStore';
import { EMPTY_POINT } from '../../../utils/constants';
import { transformPoint } from '../../../utils/math';
import { Point } from '../../../utils/types';
import ImageMapLayer from '../../common/image-map-layer/ImageMapLayer';

type CustomMapDisplayProps = {
  testPoint: Point
};

function CustomMapDisplay({ testPoint }: CustomMapDisplayProps) {
  const { referenceMarkers, customImageMapInfo, computeTransformationMatrix } = useCustomMapStore();

  if (customImageMapInfo === null) {
    return (
      <div>No map loaded</div>
    );
  }

  const transformationMatrix = computeTransformationMatrix();
  const testPointCoordinates = transformationMatrix === null
    ? EMPTY_POINT
    : transformPoint(transformationMatrix, testPoint);
  const bounds = latLngBounds([[0, 0], [customImageMapInfo.height, customImageMapInfo.width]]);

  // Auxiliary component to handle the maxBounds on image change
  function MaxBoundsController({ maxBounds }: { maxBounds: LatLngBounds }) {
    const map = useMap();
    useEffect(() => {
      map.setMaxBounds(maxBounds);
    }, [map, maxBounds]);
    return null;
  }

  return (
    <MapContainer
      className="custom-map-display"
      crs={CRS.Simple}
      zoom={1}
      zoomSnap={0.1}
      maxBoundsViscosity={1}
    >
      <MaxBoundsController maxBounds={bounds} />
      <ImageMapLayer image={customImageMapInfo} />
      {
        [...referenceMarkers.values()].map((marker) => (
          <ReferenceMarker key={marker.id} referenceMarker={marker} />
        ))
      }
      {
          Number.isFinite(testPointCoordinates[0])
          && Number.isFinite(testPointCoordinates[1])
          && (
          <Marker
            position={testPointCoordinates}
            icon={TargetIcon}
          />
          )
      }
    </MapContainer>
  );
}

export default CustomMapDisplay;
