import type { PropsWithChildren } from 'react';
import { Fade, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { useUsersProfileRetrieve } from '../../../api/queries/users';
import GameButton from '../../common/styled/GameButton';

export type SideNavigationRouteProps = PropsWithChildren<{
  route: string,
  label: string,
  requiresAuth?: boolean,
}>;

function SideNavigationRoute({
  route,
  label,
  requiresAuth = false,
  children,
}: SideNavigationRouteProps) {
  const { pathname } = useLocation();
  const { data: userInfo } = useUsersProfileRetrieve();
  if (requiresAuth && !userInfo) return null;
  const selected = pathname.startsWith(`/${route}`);
  return (
    <Stack spacing={1}>
      <GameButton href={route} selected={selected}>
        { label }
      </GameButton>
      <Fade in={selected}>
        <Stack spacing={1}>
          { children }
        </Stack>
      </Fade>
    </Stack>
  );
}

export default SideNavigationRoute;
