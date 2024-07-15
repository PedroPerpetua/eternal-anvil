import { useLocation } from 'react-router-dom';

import { useAuthContext } from '../../../api/AuthContext';
import PrimaryGameButton from '../../common/styled/PrimaryGameButton';

export type SideNavigationRouteProps = {
  route: string,
  label: string,
  requiresAuth?: boolean
};

function SideNavigationRoute({ route, label, requiresAuth = false }: SideNavigationRouteProps) {
  const { userInfo } = useAuthContext();
  const { pathname } = useLocation();
  if (requiresAuth && !userInfo) return null;
  const selected = pathname.startsWith(`/${route}`);
  return (
    <PrimaryGameButton
      href={route}
      sx={{
        backgroundColor: selected ? 'primary.dark' : undefined,
        borderColor: selected ? undefined : 'primary.main',
      }}
    >
      { label }
    </PrimaryGameButton>
  );
}

export default SideNavigationRoute;
