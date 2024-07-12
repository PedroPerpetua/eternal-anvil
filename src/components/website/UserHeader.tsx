import { useState } from 'react';
import { clearAuthTokens, getRefreshToken } from 'axios-jwt';

import { useAuthContext } from '../../api/AuthContext';
import { useUsersLogoutCreate } from '../../api/queries/user-authentication/user-authentication';
import PrimaryGameButton from '../common/styled/PrimaryGameButton';

function UserHeader() {
  const { userInfo, refreshUser } = useAuthContext();
  const [showLogout, setShowLogout] = useState(false);
  const { mutate: logout } = useUsersLogoutCreate({ mutation: {
    onSuccess: async () => {
      clearAuthTokens();
      await refreshUser();
    },
    onMutate: () => {
      setShowLogout(false);
    },
  } });

  if (!userInfo) {
    return (
      <PrimaryGameButton href="/login">
        Login
      </PrimaryGameButton>
    );
  }

  if (showLogout) {
    return (
      <PrimaryGameButton
        onClick={async () => {
          const refreshToken = await getRefreshToken();
          if (refreshToken) logout({ data: { refresh: refreshToken } });
        }}
      >
        Logout?
      </PrimaryGameButton>
    );
  }

  return (
    <PrimaryGameButton onClick={() => setShowLogout(true)}>
      { userInfo.username }
    </PrimaryGameButton>
  );
}

export default UserHeader;
