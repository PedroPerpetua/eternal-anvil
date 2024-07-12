import { useAuthContext } from '../../api/AuthContext';
import GameButton from '../common/styled/GameButton';

function RealmManagerButton() {
  const { userInfo } = useAuthContext();
  return (
    <GameButton disabled={!userInfo} href="/realm-manager">
      Realm Manager
    </GameButton>
  );
}

export default RealmManagerButton;
