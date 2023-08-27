import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import { useAppSelector } from '../../../store';
import { realmSelectors } from '../../../store/realmsSlice';
import { structuresSelectors } from '../../../store/structuresSlice';
import { STRUCTURES_DATA } from '../../../utils/gameData';
import { transformPoint } from '../../../utils/math';
import MapMarker from '../../common/MapMarker';

const DEFAULT_COLOR = '#ffffff';

type StructureMarkerProps = {
  id: EntityId
};

function StructureMarker({ id }: StructureMarkerProps) {
  const structureData = useAppSelector((state) => {
    const structure = structuresSelectors.selectById(state.structures, id);
    if (!structure) return null;
    const realm = realmSelectors.selectById(state.realms, structure.realm ?? '');
    const structureInfo = STRUCTURES_DATA[structure.type];
    return {
      icon: structureInfo.icon,
      size: structureInfo.size,
      color: realm?.color ?? DEFAULT_COLOR,
      position: structure.coordinates,
    };
  }, shallowEqual);
  const transformationMatrix = useAppSelector(
    (state) => state.mapInfo.transformationMatrix,
    shallowEqual,
  );
  if (!structureData) return null;

  return (
    <MapMarker
      icon={structureData.icon}
      iconSize={structureData.size}
      iconColor={structureData.color}
      markerProps={{
        position: transformPoint(transformationMatrix, structureData.position),
      }}
    />
  );
}

function StructuresController() {
  const structureIds = useAppSelector((state) => structuresSelectors.selectIds(state.structures));
  return (
    <>
      { structureIds.map((id) => (<StructureMarker key={id} id={id} />)) }
    </>
  );
}

export default StructuresController;
