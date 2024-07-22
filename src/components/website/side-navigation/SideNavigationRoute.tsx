import { useLocation } from 'react-router-dom';

import { useUsersProfileRetrieve } from '../../../api/queries/users';
import GameButton from '../../common/styled/GameButton';

export type SideNavigationRouteProps = {
  route: string,
  label: string,
  requiresAuth?: boolean
};

function SideNavigationRoute({ route, label, requiresAuth = false }: SideNavigationRouteProps) {
  const { data: userInfo } = useUsersProfileRetrieve();
  const { pathname } = useLocation();
  if (requiresAuth && !userInfo) return null;
  const selected = pathname.startsWith(`/${route}`);
  return (
    <GameButton
      href={route}
      disableElevation={!selected}
      sx={{
        backgroundColor: selected ? 'primary.dark' : undefined,
        borderColor: selected ? undefined : 'primary.main',
      }}
    >
      { label }
    </GameButton>
  );
}

export default SideNavigationRoute;
