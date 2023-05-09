import { Marker } from 'react-leaflet';

import useBattleMapStore, { StructureInfo } from '../../../hooks/useBattleMapStore';
import useRefMarkerColor from '../../../hooks/useRefMarkerColor';
import { STRUCTURES } from '../../../utils/constants';

import './MapDisplay.scss';

type StructureMarkerProps = {
  structure: StructureInfo
};

function StructureMarker({ structure }: StructureMarkerProps) {
  const { intendedToDisplay, selectStructureForEdge, getTeam } = useBattleMapStore();
  // Setting the filter over the marker
  const markerRef = useRefMarkerColor(getTeam(structure.team)?.color ?? '#fff');

  return (
    <Marker
      ref={markerRef}
      icon={STRUCTURES[structure.type].icon}
      position={intendedToDisplay(structure.coordinates)}
      eventHandlers={{
        click: () => selectStructureForEdge(structure.id),
      }}
    />
  );
}

export default StructureMarker;
