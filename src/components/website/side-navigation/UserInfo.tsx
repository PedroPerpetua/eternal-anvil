import ErrorIcon from '@mui/icons-material/Error';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { clearAuthTokens, getRefreshToken } from 'axios-jwt';
import { t } from 'i18next';

import { useHealthcheck } from '../../../api/queries/core';
import { useUsersLogout } from '../../../api/queries/user-authentication';
import { useUsersProfileRetrieve } from '../../../api/queries/users';
import DiscordLogo from '../../../assets/discord.png';
import CustomIcon from '../../common/CustomIcon';
import GameButton from '../../common/styled/GameButton';

const DISCORD_OAUTH_URL = import.meta.env.VITE_DISCORD_OAUTH_URL;

function UserInfo() {
  const queryClient = useQueryClient();
  const { isError, isLoading: isLoadingPing } = useHealthcheck();
  const { data: userInfo, isLoading, queryKey } = useUsersProfileRetrieve();
  const { mutate: logout } = useUsersLogout({ mutation: {
    onSuccess: async () => {
      clearAuthTokens();
      await queryClient.resetQueries({ queryKey, exact: true });
    },
  } });
  if (isLoading || isLoadingPing) {
    return (
      <Stack alignItems="center">
        <CircularProgress size={25} sx={{ color: 'primary.contrastText' }} />
      </Stack>
    );
  }
  if (isError) {
    return (
      <Stack spacing={1} direction="row" justifyContent="center" alignItems="center">
        <ErrorIcon />
        <Typography>{ t('auth.serverUnavailable') }</Typography>
      </Stack>
    );
  }
  if (!userInfo) {
    return (
      <GameButton
        color="discord"
        startIcon={(<CustomIcon src={DiscordLogo} size="small" />)}
        href={DISCORD_OAUTH_URL}
        size="large"
        sx={{ borderColor: 'white' }}
      >
        { t('auth.discordLogin') }
      </GameButton>
    );
  }
  return (
    <>
      <Typography variant="h6" textAlign="center">{ userInfo.username }</Typography>
      <GameButton
        color="error"
        onClick={async () => {
          const refreshToken = await getRefreshToken();
          if (refreshToken) logout({ data: { refresh: refreshToken } });
        }}
        sx={{ borderColor: 'white' }}
      >
        { t('auth.logout') }
      </GameButton>
    </>
  );
}

export default UserInfo;
