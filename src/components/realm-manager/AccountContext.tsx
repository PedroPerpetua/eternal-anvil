import { createContext, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import type { AccountDetails } from '../../api/models';
import { useRealmManagerAccountsRetrieve } from '../../api/queries/realm-manager-accounts';
import Loading from '../website/Loading';

const AccountContextVar = createContext<AccountDetails>(null!);

type AccountContextParams = {
  accountId: string
};

function AccountContext() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accountId } = useParams<AccountContextParams>();
  const { data: accountDetails, isLoading } = useRealmManagerAccountsRetrieve(accountId!);
  if (isLoading) return (<Loading />);
  if (!accountDetails) {
    enqueueSnackbar(t('common.errors.default'), { variant: 'error' });
    return (<Navigate to=".." />);
  }
  return (
    <AccountContextVar.Provider value={accountDetails}>
      <Outlet />
    </AccountContextVar.Provider>
  );
}

export function useAccountContext() {
  return useContext(AccountContextVar);
}

export default AccountContext;
