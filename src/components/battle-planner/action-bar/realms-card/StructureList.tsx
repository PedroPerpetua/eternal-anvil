import { memo } from 'react';
import { List, Typography } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

import StructureListItem from './StructureListItem';
import { useAppSelector } from '../../../../store';
import { structuresSelectors } from '../../../../store/battle-planner/battle-map/structuresSlice';

type StructureListProps = {
  realmId: EntityId
};

const StructureList = memo(({ realmId }: StructureListProps) => {
  const structureIds = useAppSelector(
    (state) => structuresSelectors.getStructureIdsForRealm(state, realmId),
  );
  if (structureIds.length === 0) {
    return (
      <Typography variant="subtitle2" color="gray" textAlign="center">
        No structures
      </Typography>
    );
  }
  return (
    <List dense disablePadding sx={{ marginTop: '5px' }}>
      {
        structureIds.map((structureId) => (
          <StructureListItem key={structureId} structureId={structureId} />
        ))
      }
    </List>
  );
});

export default StructureList;
