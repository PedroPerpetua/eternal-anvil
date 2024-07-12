import { useEffect } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { setAuthTokens } from 'axios-jwt';
import { Navigate, useSearchParams } from 'react-router-dom';

import { useAuthContext } from '../api/AuthContext';
import { useUsersLoginDiscordCreate } from '../api/queries/user-authentication/user-authentication';
import DiscordLogo from '../assets/discord.png';
import CustomIcon from '../components/common/CustomIcon';
import GameButton from '../components/common/styled/GameButton';

const DISCORD_OAUTH_URL = import.meta.env.VITE_DISCORD_OAUTH_URL;

function LoginPage() {
  const [searchParams] = useSearchParams();
  const { userInfo, refreshUser } = useAuthContext();

  const code = searchParams.get('code');
  const {
    data: tokens,
    mutate: discordLogin,
    isPending,
    isError,
  } = useUsersLoginDiscordCreate({ mutation: {
    onSuccess: ({ access, refresh }) => {
      setAuthTokens({ accessToken: access, refreshToken: refresh });
      refreshUser();
    },
  } });

  useEffect(() => {
    if (!code) return;
    discordLogin({ data: { code } });
  }, [code, discordLogin]);

  if (userInfo) {
    return (<Navigate to="/" replace />);
  }

  let content = (<Typography variant="h6">Loading...</Typography>);
  if (isError) content = (<Typography variant="h6">Something went wrong!</Typography>);
  if (tokens) content = (<Typography variant="h6">Login successful! Redirecting...</Typography>);
  return (
    <>
      <Box
        sx={{
          flex: 1,
          height: '100%',
          padding: '25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
          Login with Discord
        </GameButton>
      </Box>
      <Modal open={isPending}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '5px',
            width: 'min(700px, 90vw)',
            maxHeight: '90dvh',
            overflowY: 'auto',
          }}
        >
          { content }
        </Box>
      </Modal>
    </>
  );
}

export default LoginPage;
