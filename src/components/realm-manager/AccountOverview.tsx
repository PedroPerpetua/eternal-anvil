import { Typography } from '@mui/material';

import { useRealmManagerAccountsRetrieve } from '../../api/queries/realm-manager-accounts';
import Loading from '../website/Loading';

type AccountOverviewProps = {
  accountId: string
};

function AccountOverview({ accountId }: AccountOverviewProps) {
  const { data: accountData, isLoading } = useRealmManagerAccountsRetrieve(accountId!);
  if (isLoading) return (<Loading />);
  if (!accountData) return 'error';
  return (
    <Typography>
      { JSON.stringify(accountData) }
    </Typography>
  );
}

export default AccountOverview;
