import { Stack, Typography } from '@mui/material';
import { shallowEqual } from 'react-redux';

import CreateListItem from './CreateListItem';
import DeleteDialog from './DeleteDialog';
import RealmListItem from './RealmListItem';
import RealmsIcon from '../../../../assets/realms-icon.png';
import { ActionBarTabId } from '../../../../store/battle-planner/action-bar/currentTabSlice';
import { useBattleMapSelector } from '../../../../store/battle-planner/battle-map';
import { realmSelectors } from '../../../../store/battle-planner/battle-map/realmsSlice';
import CustomIcon from '../../../common/CustomIcon';
import ActionBarButton from '../ActionBarButton';
import ActionBarCard from '../ActionBarCard';

const TAB_ID: ActionBarTabId = 'realms';

function RealmsButton() {
  return (
    <ActionBarButton tabId={TAB_ID} tooltip="Realms">
      <CustomIcon src={RealmsIcon} tintColor="#d8bc68" />
    </ActionBarButton>
  );
}

function RealmsCard() {
  const realmIds = useBattleMapSelector(
    (state) => realmSelectors.selectIds(state.realms),
    shallowEqual,
  );
  return (
    <ActionBarCard tabId={TAB_ID}>
      <Typography variant="h6">
        Realms
      </Typography>
      <Stack spacing={1}>
        { realmIds.map((id) => (<RealmListItem key={id} id={id} />)) }
        <CreateListItem />
      </Stack>
      <DeleteDialog />
    </ActionBarCard>
  );
}

RealmsCard.Button = RealmsButton;

export default RealmsCard;
