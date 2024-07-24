import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import AccountData from './AccountData';
import PlayerTable from './PlayerTable';
import { useRealmManagerAccountsRetrieve } from '../../../../api/queries/realm-manager-accounts';
import Loading from '../../../website/Loading';
import { Tab, TabButton } from '../AccountOverviewTabs';
import type { TabValue } from '../AccountOverviewTabs';

const value: TabValue = 'account';

function AccountTabButton() {
  const { t } = useTranslation();
  return (
    <TabButton value={value}>{ t('realmManager.account.overview.accountTab.label') }</TabButton>
  );
}

function AccountTab() {
  const { accountId } = useParams();
  const { data: accountData, isLoading } = useRealmManagerAccountsRetrieve(accountId!);
  if (isLoading) return (<Loading />);
  if (!accountData) return null;

  return (
    <Tab value={value}>
      <Grid container spacing={2}>
        <Grid xs={12} md={6} display="flex" alignItems="center">
          <AccountData accountId={accountData.id} />
        </Grid>
        <Grid xs={12} md={6}>
          <PlayerTable accountId={accountData.id} />
        </Grid>
      </Grid>
    </Tab>
  );
}

AccountTab.Button = AccountTabButton;

export default AccountTab;
