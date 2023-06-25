import useBattleMapStore, { StructureInfo } from '../../../hooks/useBattleMapStore';
import { STRUCTURES } from '../../../utils/constants';
import MapMarker from '../../common/map-marker/MapMarker';

type StructureMarkerProps = {
  structure: StructureInfo
};

function StructureMarker({ structure }: StructureMarkerProps) {
  const { intendedToDisplay, selectStructureForEdge, getTeam } = useBattleMapStore();
  const structureInfo = STRUCTURES[structure.type];

  return (
    <MapMarker
      icon={structureInfo.icon}
      iconSize={structureInfo.size}
      iconColor={getTeam(structure.team)?.color ?? '#ffffff'}
      markerProps={{
        position: intendedToDisplay(structure.coordinates),
        eventHandlers: {
          click: () => selectStructureForEdge(structure.id),
        },
      }}
    />
  );
}

export default StructureMarker;
