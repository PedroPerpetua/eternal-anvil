import { memo } from 'react';
import type { EntityId } from '@reduxjs/toolkit';
import { Polyline } from 'react-leaflet';

import useMapZoom from '../../../hooks/useMapZoom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { edgesTabSelectors } from '../../../store/battle-planner/action-bar/edgesTabSlice';
import { edgesSelectors, edgesActions } from '../../../store/battle-planner/battle-map/edgesSlice';
import { mapInfoSelectors } from '../../../store/battle-planner/battle-map/mapInfoSlice';
import { gameToLeaflet } from '../../../utils/math';

type EdgeProps = {
  edgeId: EntityId
};

const Edge = memo(({ edgeId }: EdgeProps) => {
  const dispatch = useAppDispatch();
  const toolMode = useAppSelector(edgesTabSelectors.toolMode);
  const transformationMatrix = useAppSelector(mapInfoSelectors.transformationMatrix);
  const zoom = useMapZoom();
  const edgeData = useAppSelector((state) => edgesSelectors.getEdgeData(state, edgeId));

  const handleClick = () => {
    if (toolMode !== 'delete') return;
    dispatch(edgesActions.deleteEdge({ edgeId }));
  };

  if (!edgeData) return null;
  return (
    <Polyline
      pathOptions={{
        color: edgeData.color,
        weight: 5 * (zoom + 1),
      }}
      eventHandlers={{ click: handleClick }}
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
  const edgeIds = useAppSelector(edgesSelectors.getEdgeIds);
  return (
    <>
      { edgeIds.map((id) => <Edge key={id} edgeId={id} />) }
    </>
  );
}

export default EdgesController;
