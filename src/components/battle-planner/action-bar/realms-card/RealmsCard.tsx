import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { shallowEqual } from 'react-redux';

import CreateListItem from './CreateListItem';
import DeleteDialog from './DeleteDialog';
import RealmListItem from './RealmListItem';
import { RealmsCardListContextProvider } from './RealmsCardListContext';
import RealmsIcon from '../../../../assets/realms-icon.png';
import useBattleMapSelector from '../../../../store/battleMap';
import { realmSelectors } from '../../../../store/battleMap/realmsSlice';
import ActionBarButton from '../ActionBarButton';
import ActionBarCard from '../ActionBarCard';
import { TabId } from '../ActionBarContext';

const VALUE: TabId = 'realms';

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
