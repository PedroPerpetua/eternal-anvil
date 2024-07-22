import { useEffect } from 'react';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { setAuthTokens } from 'axios-jwt';
import { useTranslation } from 'react-i18next';
import { Navigate, useSearchParams } from 'react-router-dom';

import { useUsersDiscordLogin } from '../api/queries/user-authentication';
import { useUsersProfileRetrieve } from '../api/queries/users';
import Modal from '../components/common/styled/Modal';

function LoginCallbackPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { data: userInfo, refetch: refreshUser } = useUsersProfileRetrieve();

  const code = searchParams.get('code');
  const { data: tokens, mutate: discordLogin, isError } = useUsersDiscordLogin({ mutation: {
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
      { content }
    </Modal>
  );
}

export default LoginCallbackPage;
