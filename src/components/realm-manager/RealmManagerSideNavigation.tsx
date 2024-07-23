import { useParams } from 'react-router-dom';

import { useRealmManagerAccountsList } from '../../api/queries/realm-manager-accounts';
import GameButton from '../common/styled/GameButton';

function RealmManagerSideNavigation() {
  const { accountId } = useParams();
  const { data: accounts } = useRealmManagerAccountsList();
  if (!accounts) return null;
  return accounts.map((acc) => (
    <GameButton
      key={acc.id}
      href={`/realm-manager/${acc.id}`}
      selected={accountId === acc.id}
      size="small"
    >
      { `[${acc.game_world.code}] ${acc.name}` }
    </GameButton>
  ));
}

export default RealmManagerSideNavigation;
