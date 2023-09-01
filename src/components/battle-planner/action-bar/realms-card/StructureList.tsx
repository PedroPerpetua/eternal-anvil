import { memo } from 'react';
import {
  List, ListItemButton, ListItemIcon, ListItemText, Typography,
} from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { useMap } from 'react-leaflet';
import { shallowEqual } from 'react-redux';

import useBattleMapSelector from '../../../../store/battleMap';
import { structuresSelectors } from '../../../../store/battleMap/structuresSlice';
import { STRUCTURES_DATA } from '../../../../utils/gameData';
import { gameToLeaflet } from '../../../../utils/math';
import CustomIcon from '../../../common/CustomIcon';

type StructureListProps = {
  realmId: EntityId | null
};

const StructureList = memo(({ realmId }: StructureListProps) => {
  const map = useMap();
  const structures = useBattleMapSelector(
    (state) => structuresSelectors.selectAll(state.structures).filter((s) => s.realm === realmId),
    shallowEqual,
  );
  const transformationMatrix = useBattleMapSelector(
    (state) => state.mapInfo.transformationMatrix,
    shallowEqual,
  );
  if (structures.length === 0) {
    return (
      <Typography variant="subtitle2" color="gray" textAlign="center">
        No structures
      </Typography>
    );
  }
  return (
    <List dense disablePadding sx={{ marginTop: '5px' }}>
      {
        structures.map((s) => (
          <ListItemButton
            key={s.id}
            onClick={() => map.setView(gameToLeaflet(transformationMatrix, s.coordinates))}
          >
            <ListItemIcon>
              <CustomIcon src={STRUCTURES_DATA[s.type].icon} />
            </ListItemIcon>
            <ListItemText>
              { STRUCTURES_DATA[s.type].name }
              { ' ' }
              (
              { s.coordinates[0] }
              |
              { s.coordinates[1] }
              )
            </ListItemText>
          </ListItemButton>
        ))
      }
    </List>
  );
});

export default StructureList;
