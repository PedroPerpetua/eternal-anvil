import { memo } from 'react';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import useBattleMapSelector from '../../../store/battleMap';
import { realmSelectors } from '../../../store/battleMap/realmsSlice';
import { structuresSelectors } from '../../../store/battleMap/structuresSlice';
import { NEUTRAL_COLOR, STRUCTURES_DATA } from '../../../utils/gameData';
import { transformPoint } from '../../../utils/math';
import MapMarker from '../../common/MapMarker';

type StructureMarkerProps = {
  id: EntityId
};

const StructureMarker = memo(({ id }: StructureMarkerProps) => {
  const structureData = useBattleMapSelector((state) => {
    const structure = structuresSelectors.selectById(state.structures, id);
    if (!structure) return null;
    const realm = realmSelectors.selectById(state.realms, structure.realm ?? '');
    const structureInfo = STRUCTURES_DATA[structure.type];
    return {
      icon: structureInfo.icon,
      size: structureInfo.size,
      color: realm?.color ?? NEUTRAL_COLOR,
      position: structure.coordinates,
    };
  }, shallowEqual);
  const transformationMatrix = useBattleMapSelector(
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
});

function StructuresController() {
  const structureIds = useBattleMapSelector(
    (state) => structuresSelectors.selectIds(state.structures),
    shallowEqual,
  );
  return (
    <>
      { structureIds.map((id) => (<StructureMarker key={id} id={id} />)) }
    </>
  );
}

export default StructuresController;
