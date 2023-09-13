import { memo } from 'react';
import { EntityId } from '@reduxjs/toolkit';
import { Polyline } from 'react-leaflet';
import { shallowEqual } from 'react-redux';

import { useBattleMapSelector } from '../../../store/battle-planner/battle-map';
import { edgesSelectors } from '../../../store/battle-planner/battle-map/edgesSlice';
import { realmSelectors } from '../../../store/battle-planner/battle-map/realmsSlice';
import { structuresSelectors } from '../../../store/battle-planner/battle-map/structuresSlice';
import { blendColors } from '../../../utils/images';
import { gameToLeaflet } from '../../../utils/math';

type EdgeProps = {
  id: EntityId
};

const Edge = memo(({ id }: EdgeProps) => {
  const transformationMatrix = useBattleMapSelector(
    (state) => state.mapInfo.transformationMatrix,
    shallowEqual,
  );
  const edgeData = useBattleMapSelector((state) => {
    const edge = edgesSelectors.selectById(state.edges, id);
    if (!edge) return null;
    const structure1 = structuresSelectors.selectById(state.structures, edge.structure1);
    if (!structure1) return null;
    const realm1 = realmSelectors.selectById(state.realms, structure1.realm);
    if (!realm1) return null;
    const structure2 = structuresSelectors.selectById(state.structures, edge.structure2);
    if (!structure2) return null;
    const realm2 = realmSelectors.selectById(state.realms, structure2.realm);
    if (!realm2) return null;
    return {
      start: structure1.coordinates,
      end: structure2.coordinates,
      color: blendColors(realm1.color, realm2.color),
    };
  }, shallowEqual);

  if (!edgeData) return null;
  return (
    <Polyline
      pathOptions={{
        color: edgeData.color,
        weight: 5,
      }}
      positions={
          [
            gameToLeaflet(transformationMatrix, edgeData.start),
            gameToLeaflet(transformationMatrix, edgeData.end),
          ]
        }
    />
  );
});

function EdgesController() {
  const edgeIds = useBattleMapSelector((state) => edgesSelectors.selectIds(state.edges));
  return (
    <>
      { edgeIds.map((id) => <Edge key={id} id={id} />) }
    </>
  );
}

export default EdgesController;
