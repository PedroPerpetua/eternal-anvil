import {
  memo, useCallback, useEffect, useRef, useState,
} from 'react';
import { IconButton } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { Marker as LeafletMarker } from 'leaflet';
import { useMap } from 'react-leaflet';
import { shallowEqual } from 'react-redux';

import { useAppDispatch } from '../../../store';
import { useBattleMapSelector } from '../../../store/battleMap';
import { realmSelectors } from '../../../store/battleMap/realmsSlice';
import { deleteStructure, structuresSelectors } from '../../../store/battleMap/structuresSlice';
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
          markerProps={{
            position: gameToLeaflet(transformationMatrix, structureData.position),
            eventHandlers: {
              click: handleOpenMenu,
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
