import { createContext, useContext, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { UserProfile } from './models';
import { useUsersProfileRetrieve } from './queries/users/users';

type AuthContextValue = {
  userInfo: UserProfile | null,
  isLoading: boolean,
  refreshUser: () => Promise<void>,
};

const AuthContext = createContext<AuthContextValue>({
  userInfo: null,
  isLoading: true,
  refreshUser: async () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

function AuthContextProvider({ children }: PropsWithChildren<object>) {
  const queryClient = useQueryClient();
  const { data: userInfo, refetch, queryKey, isLoading } = useUsersProfileRetrieve();

  const value: AuthContextValue = useMemo(() => ({
    userInfo: userInfo ?? null,
    isLoading,
    refreshUser: async () => {
      queryClient.removeQueries({ queryKey });
      await refetch();
    },
  }), [isLoading, queryClient, queryKey, refetch, userInfo]);

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
