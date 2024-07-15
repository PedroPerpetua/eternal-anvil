import ErrorIcon from '@mui/icons-material/Error';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { clearAuthTokens, getRefreshToken } from 'axios-jwt';
import { t } from 'i18next';

import { useAuthContext } from '../../../api/AuthContext';
import { useHealthcheck } from '../../../api/queries/core';
import { useUsersLogout } from '../../../api/queries/user-authentication';
import DiscordLogo from '../../../assets/discord.png';
import { gameColors } from '../../../theme';
import CustomIcon from '../../common/CustomIcon';
import GameButton from '../../common/styled/GameButton';

const DISCORD_OAUTH_URL = import.meta.env.VITE_DISCORD_OAUTH_URL;

const { teal } = gameColors;

function UserInfo() {
  const { isError, isLoading: isLoadingPing } = useHealthcheck();
  const { userInfo, refreshUser, isLoading } = useAuthContext();
  const { mutate: logout } = useUsersLogout({ mutation: {
    onSuccess: async () => {
      clearAuthTokens();
      await refreshUser();
    },
  } });
  if (isLoading || isLoadingPing) {
    return (
      <Stack alignItems="center">
        <CircularProgress size={25} sx={{ color: teal.contrastText }} />
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
        startIcon={(<CustomIcon src={DiscordLogo} size="small" />)}
        size="large"
        href={DISCORD_OAUTH_URL}
        sx={{
          color: 'white',
          backgroundColor: '#5865F2',
          '&:hover': { backgroundColor: '#4752c4' },
        }}
      >
        { t('auth.discordLogin') }
      </GameButton>
    );
  }
  return (
    <>
      <Typography variant="h6" textAlign="center">{ userInfo.username }</Typography>
      <GameButton
        sx={{ backgroundColor: 'error.main', '&:hover': { backgroundColor: 'error.dark' } }}
        onClick={async () => {
          const refreshToken = await getRefreshToken();
          if (refreshToken) logout({ data: { refresh: refreshToken } });
        }}
      >
        { t('auth.logout') }
      </GameButton>
    </>
  );
}

export default UserInfo;
