import { Paper, Stack } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';

import AccountTab from './account-tab/AccountTab';
import { useRealmManagerAccountsRetrieve } from '../../../api/queries/realm-manager-accounts';
import Loading from '../../website/Loading';

type AccountOverviewProps = {
  accountId: string
};

function AccountOverview({ accountId }: AccountOverviewProps) {
  const { view } = useParams();
  const { data: accountData, isLoading } = useRealmManagerAccountsRetrieve(accountId);
  if (isLoading) return (<Loading />);
  if (!accountData) return <Navigate to=".." replace />;
  if (view === undefined) return (<Navigate to={`/realm-manager/${accountId}/realm`} replace />);
  return (
    <Paper
      sx={{
        color: 'primary.contrastText',
        minWidth: '100%',
        minHeight: '100%',
        padding: '25px',
      }}
    >
      <Stack spacing={5} direction="row" justifyContent="center">
        <AccountTab.Button />
      </Stack>
      <AccountTab />
    </Paper>
  );
}

export default AccountOverview;
