import { useState } from 'react';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {
  styled, useMediaQuery, useTheme, TableCell as MUITableCell, Table, TableHead, TableRow,
  TableBody, Stack, Typography, Tooltip,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import type { User as AccountUser } from '../../../../api/models';
import { useRealmManagerAccountsRemoveUser, useRealmManagerAccountsRetrieve, useRealmManagerAccountsUpdate } from '../../../../api/queries/realm-manager-accounts';
import { useUsersProfileRetrieve } from '../../../../api/queries/users';
import CrownIconSrc from '../../../../assets/crown.png';
import CustomIcon from '../../../common/CustomIcon';
import type { CustomIconProps } from '../../../common/CustomIcon';
import GameButton from '../../../common/styled/GameButton';
import Modal from '../../../common/styled/Modal';
import useElementDimensions from '../../../common/useElementDimensions';
import Loading from '../../../website/Loading';

const TableCell = styled(MUITableCell)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  paddingTop: '5px',
  paddingBottom: '5px',
}));

const IconButton = styled(GameButton)({
  minWidth: 'unset',
  width: '48px',
  maxWidth: '48px',
});

function CrownIcon({ sx, ...props }: Omit<CustomIconProps, 'src'>) {
  const theme = useTheme();
  return (
    <CustomIcon
      src={CrownIconSrc}
      sx={{ color: theme.palette.primary.contrastText, ...sx }}
      {...props}
    />
  );
}

type ActionButtonProps = {
  accountId: string,
  player: AccountUser
};

function KickPlayerActionButton({ accountId, player }: ActionButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const { data: user } = useUsersProfileRetrieve();
  const { refetch } = useRealmManagerAccountsRetrieve(accountId, { query: { enabled: false } });
  const { mutate: kickUser, isPending } = useRealmManagerAccountsRemoveUser({ mutation: {
    onSuccess: async () => {
      await refetch();
      setOpen(false);
      enqueueSnackbar(
        t('realmManager.account.overview.accountTab.playerTable.actions.kick.success'),
        { variant: 'success' },
      );
    },
    onError: (e) => {
      console.error('Failed to remove user', e);
      enqueueSnackbar(
        t('realmManager.account.overview.accountTab.playerTable.actions.kick.error'),
        { variant: 'error' },
      );
    },
  } });

  const buttonEl = isMobile
    ? (
      <IconButton
        color="error"
        size="small"
        onClick={() => setOpen(true)}
        disabled={player.id === user?.id}
      >
        <PersonRemoveIcon />
      </IconButton>
    )
    : (
      <GameButton
        color="error"
        size="small"
        onClick={() => setOpen(true)}
        startIcon={<PersonRemoveIcon />}
        disabled={player.id === user?.id}
      >
        { t('realmManager.account.overview.accountTab.playerTable.actions.kick.label') }
      </GameButton>
    );
  return (
    <>
      { buttonEl }
      <Modal open={open} onClose={() => !isPending && setOpen(false)}>
        <Stack spacing={1}>
          <Typography variant="h6">
            {
              t(
                'realmManager.account.overview.accountTab.playerTable.actions.kick.title',
                { user: player.username },
              )
            }
          </Typography>
          <Typography>
            { t('realmManager.account.overview.accountTab.playerTable.actions.kick.message') }
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <GameButton color="teal" onClick={() => setOpen(false)} disabled={isPending}>
              { t('common.buttons.cancel') }
            </GameButton>
            <GameButton
              color="error"
              onClick={() => kickUser({ id: accountId, userId: player.id })}
              disabled={isPending}
            >
              {
                t(
                  'realmManager.account.overview.accountTab.playerTable.actions.kick.submit',
                  { user: player.username },
                )
              }
            </GameButton>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}

function MakeOwnerActionButton({ accountId, player }: ActionButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const { data: user } = useUsersProfileRetrieve();
  const { refetch } = useRealmManagerAccountsRetrieve(accountId, { query: { enabled: false } });
  const { mutate: updateAccount, isPending } = useRealmManagerAccountsUpdate({ mutation: {
    onSuccess: async () => {
      await refetch();
      setOpen(false);
      enqueueSnackbar(
        t('realmManager.account.overview.accountTab.playerTable.actions.makeOwner.success'),
        { variant: 'success' },
      );
    },
    onError: (e) => {
      console.error('Failed to update account', e);
      enqueueSnackbar(
        t('realmManager.account.overview.accountTab.playerTable.actions.makeOwner.error'),
        { variant: 'error' },
      );
    },
  } });

  const buttonEl = isMobile
    ? (
      <IconButton
        color="teal"
        size="small"
        onClick={() => setOpen(true)}
        disabled={player.id === user?.id}
      >
        <CrownIcon />
      </IconButton>
    )
    : (
      <GameButton
        color="teal"
        size="small"
        onClick={() => setOpen(true)}
        startIcon={<CrownIcon />}
        disabled={player.id === user?.id}
      >
        { t('realmManager.account.overview.accountTab.playerTable.actions.makeOwner.label') }
      </GameButton>
    );

  return (
    <>
      { buttonEl }
      <Modal open={open} onClose={() => !isPending && setOpen(false)}>
        <Stack spacing={1}>
          <Typography variant="h6">
            {
              t(
                'realmManager.account.overview.accountTab.playerTable.actions.makeOwner.title',
                { user: player.username },
              )
            }
          </Typography>
          <Typography>
            { t('realmManager.account.overview.accountTab.playerTable.actions.makeOwner.message') }
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <GameButton color="teal" onClick={() => setOpen(false)} disabled={isPending}>
              { t('common.buttons.cancel') }
            </GameButton>
            <GameButton
              color="primary"
              onClick={() => updateAccount({ id: accountId, data: { owner: player.id } })}
              disabled={isPending}
            >
              {
                t(
                  'realmManager.account.overview.accountTab.playerTable.actions.makeOwner.submit',
                  { user: player.username },
                )
              }
            </GameButton>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}

type PlayerTableProps = {
  accountId: string
};

function PlayerTable({ accountId }: PlayerTableProps) {
  const { t } = useTranslation();
  const { data: user } = useUsersProfileRetrieve();
  const { data: accountData, isLoading } = useRealmManagerAccountsRetrieve(accountId!);
  const { ref, width: actionsWidth } = useElementDimensions();
  if (isLoading) return (<Loading />);
  if (!accountData) return null;

  const isOwner = accountData.owner === user?.id;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            { t('realmManager.account.overview.accountTab.playerTable.fields.player') }
          </TableCell>
          {
            isOwner && (
              <TableCell>
                { t('realmManager.account.overview.accountTab.playerTable.fields.actions') }
              </TableCell>
            )
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          accountData.players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>{ player.username }</Typography>
                  {
                    player.id === accountData.owner && (
                      <Tooltip
                        title={t('realmManager.account.overview.accountTab.playerTable.isOwner')}
                      >
                        <div>
                          <CrownIcon />
                        </div>
                      </Tooltip>
                    )
                  }
                </Stack>
              </TableCell>
              {
                isOwner && (
                  <TableCell sx={{ width: actionsWidth }}>
                    <Stack ref={ref} direction="row" spacing={1} width="max-content">
                      <KickPlayerActionButton accountId={accountData.id} player={player} />
                      <MakeOwnerActionButton accountId={accountData.id} player={player} />
                    </Stack>
                  </TableCell>
                )
              }
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
}

export default PlayerTable;
