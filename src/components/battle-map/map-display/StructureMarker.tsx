import { Icon } from 'leaflet';
import { Marker } from 'react-leaflet';

import TowerIcon from '../../../assets/tower-icon.png';
import useRefMarkerColor from '../../../hooks/useRefMarkerColor';
import { Structure } from '../../../utils/constants';
import { HexColor, Point } from '../../../utils/types';
import TargetIcon from '../custom-map-dialog/TargetIcon';

import './MapDisplay.scss';

const LeafletTowerIcon = new Icon({
  iconUrl: TowerIcon,
  iconSize: [40, 40],
});

type StructureMarkerProps = {
  type: Structure,
  color: HexColor,
  displayCoordinate: Point
};

function StructureMarker({ type, color, displayCoordinate }: StructureMarkerProps) {
  // Setting the filter over the marker
  const markerRef = useRefMarkerColor(color);

  let markerIcon: Icon;

  switch (type) {
    case Structure.TOWER:
      markerIcon = LeafletTowerIcon;
      break;
    default:
      // TODO: Fix me
      markerIcon = TargetIcon;
  }

  return (
    <Marker
      ref={markerRef}
      icon={markerIcon}
      position={displayCoordinate}
    />
  );
}

export default StructureMarker;
