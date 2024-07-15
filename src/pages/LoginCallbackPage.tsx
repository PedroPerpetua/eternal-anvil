import { useEffect } from 'react';
import {
  Box, Button, CircularProgress, Modal, Stack, Typography,
} from '@mui/material';
import { setAuthTokens } from 'axios-jwt';
import { useTranslation } from 'react-i18next';
import { Navigate, useSearchParams } from 'react-router-dom';

import { useAuthContext } from '../api/AuthContext';
import { useUsersLoginDiscordCreate } from '../api/queries/user-authentication';

function LoginCallbackPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { userInfo, refreshUser } = useAuthContext();

  const code = searchParams.get('code');
  const { data: tokens, mutate: discordLogin, isError } = useUsersLoginDiscordCreate({ mutation: {
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

  let content = (
    <Stack direction="row" spacing={2}>
      <CircularProgress />
      <Typography variant="h6">{ t('auth.loading') }</Typography>
    </Stack>
  );
  if (isError) {
    content = (
      <Stack spacing={1}>
        <Typography variant="h6">{ t('auth.error') }</Typography>
        <Button href="/" variant="contained" color="error">{ t('auth.back') }</Button>
      </Stack>
    );
  }
  if (tokens) {
    content = (
      <Typography variant="h6">{ t('auth.success') }</Typography>
    );
  }
  return (
    <Modal open>
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
  );
}

export default LoginCallbackPage;
