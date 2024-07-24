import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Typography, Tooltip, IconButton, Stack } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { useRealmManagerAccountsRetrieve } from '../../../../api/queries/realm-manager-accounts';
import { useUsersProfileRetrieve } from '../../../../api/queries/users';
import theme from '../../../../theme';

type AccountDataProps = {
  accountId: string,
};

function AccountData({ accountId }: AccountDataProps) {
  const { t } = useTranslation();
  const { data: user } = useUsersProfileRetrieve();
  const { data: accountData } = useRealmManagerAccountsRetrieve(accountId!);
  if (!accountData) return null;
  return (
    <Stack>
      {
        accountData.owner === user?.id && (
          <Stack direction="row" alignItems="center" marginBottom="-5px">
            <Typography variant="subtitle1">{ accountData.id }</Typography>
            <Tooltip title={t('realmManager.account.overview.accountTab.accountId.tooltip')}>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(accountData.id)
                    .then(() => enqueueSnackbar(
                      t('realmManager.account.overview.accountTab.accountId.success'),
                      { variant: 'success' },
                    ))
                    .catch((e) => {
                      console.error('Failed to copy Account Id to clipboard', e);
                      enqueueSnackbar(
                        t('realmManager.account.overview.accountTab.accountId.error'),
                        { variant: 'error' },
                      );
                    });
                }}
              >
                <ContentCopyIcon
                  htmlColor={theme.palette.primary.contrastText}
                  fontSize="small"
                />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
      <Typography variant="h4">{ accountData.name }</Typography>
      <Typography variant="subtitle2">
        {
          t(
            'realmManager.account.overview.accountTab.ownedBy',
            { user: accountData.players.find((p) => p.id === accountData.owner)?.username },
          )
        }
      </Typography>
    </Stack>
  );
}

export default AccountData;
