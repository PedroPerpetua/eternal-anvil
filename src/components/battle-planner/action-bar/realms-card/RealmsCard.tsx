import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { shallowEqual } from 'react-redux';

import CreateListItem from './CreateListItem';
import DeleteDialog from './DeleteDialog';
import RealmListItem from './RealmListItem';
import { RealmsCardListContextProvider } from './RealmsCardListContext';
import RealmsIcon from '../../../../assets/realms-icon.png';
import { ActionBarTabId } from '../../../../store/battle-planner/action-bar/currentTabSlice';
import { useBattleMapSelector } from '../../../../store/battle-planner/battle-map';
import { realmSelectors } from '../../../../store/battle-planner/battle-map/realmsSlice';
import ActionBarButton from '../ActionBarButton';
import ActionBarCard from '../ActionBarCard';

const VALUE: ActionBarTabId = 'realms';

function RealmsButton() {
  return <ActionBarButton value={VALUE} iconSrc={RealmsIcon} tooltip="Realms" />;
}

function RealmsCard() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const realmIds = useBattleMapSelector(
    (state) => realmSelectors.selectIds(state.realms),
    shallowEqual,
  );
  return (
    <ActionBarCard value={VALUE}>
      <Typography variant="h6">
        Realms
      </Typography>
      <RealmsCardListContextProvider>
        <Stack spacing={1}>
          {
            realmIds.map((id) => (
              <RealmListItem key={id} id={id} openDelete={() => setOpenDeleteDialog(true)} />
            ))
          }
          <CreateListItem />
        </Stack>
        <DeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} />
      </RealmsCardListContextProvider>
    </ActionBarCard>
  );
}

RealmsCard.Button = RealmsButton;

export default RealmsCard;
