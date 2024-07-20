import { Stack } from '@mui/material';

import AccountCard from './AccountCard';
import NewAccountButton from './new-account/NewAccountButton';
import { useRealmManagerAccountsList } from '../../api/queries/realm-manager-accounts';
import Loading from '../website/Loading';

function AccountsList() {
  const { data: accounts, isLoading } = useRealmManagerAccountsList();
  if (isLoading) return (<Loading />);
  if (!accounts) return null;
  return (
    <Stack spacing={1} alignItems="center">
      <NewAccountButton />
      { accounts.map((account) => (<AccountCard key={account.id} account={account} />)) }
    </Stack>
  );
}

export default AccountsList;
