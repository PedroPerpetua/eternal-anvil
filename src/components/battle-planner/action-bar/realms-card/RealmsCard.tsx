import { Stack, Typography } from '@mui/material';

import CreateListItem from './CreateListItem';
import DeleteDialog from './DeleteDialog';
import RealmListItem from './RealmListItem';
import RealmsIcon from '../../../../assets/realms-icon.png';
import { useAppSelector } from '../../../../store';
import type { ActionBarTabId } from '../../../../store/battle-planner/action-bar/currentTabSlice';
import { realmsSelectors } from '../../../../store/battle-planner/battle-map/realmsSlice';
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
  const realmIds = useAppSelector(realmsSelectors.getRealmIds);
  return (
    <ActionBarCard tabId={TAB_ID}>
      <Typography variant="h6">
        Realms
      </Typography>
      <Stack spacing={1}>
        { realmIds.map((realmId) => (<RealmListItem key={realmId} realmId={realmId} />)) }
        <CreateListItem />
      </Stack>
      <DeleteDialog />
    </ActionBarCard>
  );
}

RealmsCard.Button = RealmsButton;

export default RealmsCard;
