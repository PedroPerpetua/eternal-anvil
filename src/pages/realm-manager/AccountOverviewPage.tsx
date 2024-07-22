import { Navigate, useParams } from 'react-router-dom';

import AccountOverview from '../../components/realm-manager/AccountOverview';

type AccountOverviewParams = {
  accountId: string
};

function AccountOverviewPage() {
  const { accountId } = useParams<AccountOverviewParams>();
  if (!accountId) return (<Navigate to=".." />);
  return (<AccountOverview accountId={accountId} />);
}

export default AccountOverviewPage;
