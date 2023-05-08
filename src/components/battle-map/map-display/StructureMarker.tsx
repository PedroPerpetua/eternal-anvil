import { Icon } from 'leaflet';
import { Marker } from 'react-leaflet';

import TowerIcon from '../../../assets/tower-icon.png';
import useBattleMapStore, { StructureInfo } from '../../../hooks/useBattleMapStore';
import useRefMarkerColor from '../../../hooks/useRefMarkerColor';
import { Structure } from '../../../utils/constants';
import TargetIcon from '../custom-map-dialog/TargetIcon';

import './MapDisplay.scss';

const LeafletTowerIcon = new Icon({
  iconUrl: TowerIcon,
  iconSize: [40, 40],
});

type StructureMarkerProps = {
  structure: StructureInfo
};

function StructureMarker({ structure }: StructureMarkerProps) {
  const { intendedToDisplay, selectStructureForEdge, getTeam } = useBattleMapStore();
  // Setting the filter over the marker
  const markerRef = useRefMarkerColor(getTeam(structure.team)?.color ?? '#fff');

  let markerIcon: Icon;

  switch (structure.type) {
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
      position={intendedToDisplay(structure.coordinates)}
      eventHandlers={{
        click: () => selectStructureForEdge(structure.id),
      }}
    />
  );
}

export default StructureMarker;
