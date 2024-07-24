import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Typography, Tooltip, IconButton, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  useRealmManagerAccountsDestroy,
  useRealmManagerAccountsLeave,
  useRealmManagerAccountsList,
  useRealmManagerAccountsRetrieve,
} from '../../../../api/queries/realm-manager-accounts';
import { useUsersProfileRetrieve } from '../../../../api/queries/users';
import theme from '../../../../theme';
import GameButton from '../../../common/styled/GameButton';
import Modal from '../../../common/styled/Modal';

type ActionButtonProps = {
  accountId: string
};

function DeleteAccountButton({ accountId }: ActionButtonProps) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { refetch: refreshAccounts } = useRealmManagerAccountsList({ query: { enabled: false } });
  const { mutate: deleteAccount, isPending } = useRealmManagerAccountsDestroy({ mutation: {
    onSuccess: async () => {
      await refreshAccounts();
      enqueueSnackbar(
        t('realmManager.account.overview.accountTab.accountData.deleteAccount.success'),
        { variant: 'success' },
      );
      navigate('/realm-manager');
    },
    onError: (e) => {
      console.error('Failed to leave account', e);
      enqueueSnackbar(
        t('realmManager.account.overview.accountTab.accountData.deleteAccount.error'),
        { variant: 'error' },
      );
    },
  } });
  return (
    <>
      <GameButton
        color="error"
        onClick={() => setOpen(true)}
        sx={{ width: '200px', alignSelf: 'center' }}
      >
        { t('realmManager.account.overview.accountTab.accountData.deleteAccount.label') }
      </GameButton>
      <Modal open={open} onClose={() => !isPending && setOpen(false)}>
        <Stack spacing={1}>
          <Typography variant="h6">
            { t('realmManager.account.overview.accountTab.accountData.deleteAccount.title') }
          </Typography>
          <Typography sx={{ textAlign: 'justify' }}>
            <Trans
              i18nKey="realmManager.account.overview.accountTab.accountData.deleteAccount.message"
              components={[<Typography fontWeight="bold" />]}
            />
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <GameButton color="teal" onClick={() => setOpen(false)} disabled={isPending}>
              { t('common.buttons.cancel') }
            </GameButton>
            <GameButton
              color="error"
              onClick={() => deleteAccount({ id: accountId })}
              disabled={isPending}
            >
              { t('realmManager.account.overview.accountTab.accountData.deleteAccount.submit') }
            </GameButton>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}

function LeaveAccountButton({ accountId }: ActionButtonProps) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { refetch: refreshAccounts } = useRealmManagerAccountsList({ query: { enabled: false } });
  const { mutate: leaveAccount, isPending } = useRealmManagerAccountsLeave({ mutation: {
    onSuccess: async () => {
      await refreshAccounts();
      enqueueSnackbar(
        t('realmManager.account.overview.accountTab.accountData.leaveAccount.success'),
        { variant: 'success' },
      );
      navigate('/realm-manager');
    },
    onError: (e) => {
      console.error('Failed to leave account', e);
      enqueueSnackbar(
        t('realmManager.account.overview.accountTab.accountData.leaveAccount.error'),
        { variant: 'error' },
      );
    },
  } });
  return (
    <>
      <GameButton
        color="error"
        onClick={() => setOpen(true)}
        sx={{ width: '200px', alignSelf: 'center' }}
      >
        { t('realmManager.account.overview.accountTab.accountData.leaveAccount.label') }
      </GameButton>
      <Modal open={open} onClose={() => !isPending && setOpen(false)}>
        <Stack>
          <Typography variant="h6">
            { t('realmManager.account.overview.accountTab.accountData.leaveAccount.title') }
          </Typography>
          <Typography>
            { t('realmManager.account.overview.accountTab.accountData.leaveAccount.message') }
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <GameButton color="teal" onClick={() => setOpen(false)} disabled={isPending}>
              { t('common.buttons.cancel') }
            </GameButton>
            <GameButton
              color="error"
              onClick={() => leaveAccount({ id: accountId })}
              disabled={isPending}
            >
              { t('realmManager.account.overview.accountTab.accountData.leaveAccount.submit') }
            </GameButton>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}

type AccountDataProps = {
  accountId: string,
};

function AccountData({ accountId }: AccountDataProps) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { data: user } = useUsersProfileRetrieve();
  const { data: accountData } = useRealmManagerAccountsRetrieve(accountId!);
  if (!accountData) return null;
  return (
    <Stack>
      {
        accountData.owner === user?.id && (
          <Stack direction="row" alignItems="center" marginBottom="-5px">
            <Typography variant="subtitle1">{ accountData.id }</Typography>
            <Tooltip title={t('realmManager.account.overview.accountTab.accountData.accountId.tooltip')}>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(accountData.id)
                    .then(() => enqueueSnackbar(
                      t('realmManager.account.overview.accountTab.accountData.accountId.success'),
                      { variant: 'success' },
                    ))
                    .catch((e) => {
                      console.error('Failed to copy Account Id to clipboard', e);
                      enqueueSnackbar(
                        t('realmManager.account.overview.accountTab.accountData.accountId.error'),
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
      <Typography variant="subtitle2" sx={{ marginBottom: '15px' }}>
        {
          t(
            'realmManager.account.overview.accountTab.ownedBy',
            { user: accountData.players.find((p) => p.id === accountData.owner)?.username },
          )
        }
      </Typography>
      {
        accountData.owner === user?.id
          ? (<DeleteAccountButton accountId={accountId} />)
          : (<LeaveAccountButton accountId={accountId} />)
      }
    </Stack>
  );
}

export default AccountData;
