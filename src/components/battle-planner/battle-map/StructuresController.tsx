import {
  memo, useCallback, useEffect, useRef, useState,
} from 'react';
import { IconButton } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { Marker as LeafletMarker } from 'leaflet';
import { useMap } from 'react-leaflet';
import { shallowEqual } from 'react-redux';

import { useAppDispatch } from '../../../store';
import { useActionBarSelector } from '../../../store/battle-planner/action-bar';
import { useBattleMapSelector } from '../../../store/battle-planner/battle-map';
import { selectStructure } from '../../../store/battle-planner/battle-map/edgesSlice';
import { realmSelectors } from '../../../store/battle-planner/battle-map/realmsSlice';
import { deleteStructure, structuresSelectors } from '../../../store/battle-planner/battle-map/structuresSlice';
import { NEUTRAL_COLOR, STRUCTURES_DATA } from '../../../utils/gameData';
import { gameToLeaflet } from '../../../utils/math';
import CircularMenu from '../../common/CircularMenu';
import MapMarker from '../../common/MapMarker';
import DeleteIcon from '../../common/styled-components/DeleteIcon';

type StructureMarkerProps = {
  id: EntityId
};

const StructureMarker = memo(({ id }: StructureMarkerProps) => {
  const dispatch = useAppDispatch();
  const structureData = useBattleMapSelector((state) => {
    const structure = structuresSelectors.selectById(state.structures, id);
    if (!structure) return null;
    const realm = realmSelectors.selectById(state.realms, structure.realm ?? '');
    const structureInfo = STRUCTURES_DATA[structure.type];

    const highlighted = (
      state.edges.currentlySelected === id
      || (shallowEqual(structure.coordinates, state.mapInfo.currentMouseHover)
      ));
    return {
      icon: structureInfo.icon,
      size: structureInfo.size,
      color: realm?.color ?? NEUTRAL_COLOR,
      position: structure.coordinates,
      highlighted,
    };
  }, shallowEqual);
  const transformationMatrix = useBattleMapSelector(
    (state) => state.mapInfo.transformationMatrix,
    shallowEqual,
  );

  // Handle selection
  const toolMode = useActionBarSelector((state) => state.edgesTab.toolMode);

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
  const mapDragging = useBattleMapSelector((state) => state.mapInfo.dragging);
  useEffect(() => {
    if (mapDragging) handleCloseMenu();
  }, [mapDragging, handleCloseMenu]);

  // Handle events
  const handleClick = () => {
    if (toolMode === 'select') dispatch(selectStructure(id));
    else handleOpenMenu();
  };

  if (!structureData) return null;
  return (
    <CircularMenu
      open={openMenu}
      onClose={handleCloseMenu}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
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
      <IconButton sx={{ backgroundColor: '#056e55' }} onClick={() => dispatch(deleteStructure(id))}>
        <DeleteIcon />
      </IconButton>
    </CircularMenu>
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
