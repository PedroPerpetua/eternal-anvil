import { memo } from 'react';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';
import { useMap } from 'react-leaflet';

import { useAppSelector } from '../../../../store';
import { mapInfoSelectors } from '../../../../store/battle-planner/battle-map/mapInfoSlice';
import { structuresSelectors } from '../../../../store/battle-planner/battle-map/structuresSlice';
import { STRUCTURES_DATA } from '../../../../utils/gameData';
import { gameToLeaflet } from '../../../../utils/math';
import CustomIcon from '../../../common/CustomIcon';

type StructureListItemProps = {
  structureId: EntityId,
};

const StructureListItem = memo(({ structureId }: StructureListItemProps) => {
  const map = useMap();
  const structure = useAppSelector((state) => structuresSelectors.getStructure(state, structureId));
  const transformationMatrix = useAppSelector(mapInfoSelectors.transformationMatrix);
  return (
    <ListItemButton
      onClick={() => map.setView(gameToLeaflet(transformationMatrix, structure.coordinates))}
    >
      <ListItemIcon>
        <CustomIcon src={STRUCTURES_DATA[structure.type].icon} />
      </ListItemIcon>
      <ListItemText>
        { STRUCTURES_DATA[structure.type].name }
        { ' ' }
        (
        { structure.coordinates[0] }
        |
        { structure.coordinates[1] }
        )
      </ListItemText>
    </ListItemButton>
  );
});

export default StructureListItem;
