import {
  memo, useCallback, useEffect, useRef, useState,
} from 'react';
import { IconButton } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';
import type { Marker as LeafletMarker } from 'leaflet';
import { useMap } from 'react-leaflet';

import { useAppDispatch, useAppSelector } from '../../../store';
import { edgesTabSelectors } from '../../../store/battle-planner/action-bar/edgesTabSlice';
import { edgesActions } from '../../../store/battle-planner/battle-map/edgesSlice';
import { mapInfoSelectors } from '../../../store/battle-planner/battle-map/mapInfoSlice';
import { structuresActions, structuresSelectors } from '../../../store/battle-planner/battle-map/structuresSlice';
import { gameToLeaflet } from '../../../utils/math';
import CircularMenu from '../../common/CircularMenu';
import MapMarker from '../../common/MapMarker';
import DeleteIcon from '../../common/styled-components/DeleteIcon';

type StructureMarkerProps = {
  structureId: EntityId
};

const StructureMarker = memo(({ structureId }: StructureMarkerProps) => {
  const dispatch = useAppDispatch();
  const structureData = useAppSelector(
    (state) => structuresSelectors.getStructureData(state, structureId),
  );
  const transformationMatrix = useAppSelector(mapInfoSelectors.transformationMatrix);

  // Handle selection
  const toolMode = useAppSelector(edgesTabSelectors.toolMode);

  // Handle the menu
  const map = useMap();
  const markerRef = useRef<LeafletMarker>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const handleOpenMenu = useCallback(() => {
    map.scrollWheelZoom.disable();
    setOpenMenu(true);
  }, [map]);
  const handleCloseMenu = useCallback(() => {
    map.scrollWheelZoom.enable();
    setOpenMenu(false);
  }, [map]);
  const mapDragging = useAppSelector(mapInfoSelectors.dragging);
  useEffect(() => {
    if (mapDragging) handleCloseMenu();
  }, [mapDragging, handleCloseMenu]);

  // Handle events
  const handleClick = () => {
    if (toolMode === 'select') dispatch(edgesActions.selectStructure({ structureId }));
    else handleOpenMenu();
  };

  if (!structureData) return null;
  return (
    <CircularMenu
      open={openMenu}
      onClose={handleCloseMenu}
      // @ts-ignore - Private method
      anchorEl={markerRef.current?._icon}
      menuButton={(
        <MapMarker
          icon={structureData.icon}
          iconSize={structureData.size}
          iconColor={structureData.color}
          highlighted={structureData.highlighted || openMenu}
          markerProps={{
            position: gameToLeaflet(transformationMatrix, structureData.position),
            eventHandlers: {
              click: handleClick,
            },
          }}
          ref={markerRef}
        />
      )}
      surfaceSx={{ border: '10px solid #056e55' }}
      radius="40px"
      startAngle={0}
    >
      <IconButton
        sx={{ backgroundColor: '#056e55' }}
        onClick={() => dispatch(structuresActions.deleteStructure({ structureId }))}
      >
        <DeleteIcon />
      </IconButton>
    </CircularMenu>
  );
});

function StructuresController() {
  const structureIds = useAppSelector(structuresSelectors.getStructureIds);
  return (
    <>
      { structureIds.map((structureId) => (
        <StructureMarker key={structureId} structureId={structureId} />
      )) }
    </>
  );
}

export default StructuresController;
