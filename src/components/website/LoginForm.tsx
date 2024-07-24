import { Stack, styled, Typography } from '@mui/material';
import { setAuthTokens } from 'axios-jwt';
import { useSnackbar } from 'notistack';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import * as Yup from 'yup';

import DiscordLoginButton from './DiscordLoginButton';
import { useUsersLogin } from '../../api/queries/user-authentication';
import { useUsersProfileRetrieve } from '../../api/queries/users';
import GameButton from '../common/styled/GameButton';
import useYupResolver from '../common/useYupResolver';

const TextInput = styled(TextFieldElement)(({ theme }) => ({
  input: {
    color: theme.palette.primary.contrastText,
  },
  label: {
    color: theme.palette.primary.contrastText,
  },
  '& label.Mui-focused': {
    color: theme.palette.primary.contrastText,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.contrastText,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.contrastText,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.contrastText,
    },
  },
}));

type LoginFormValues = {
  username: string,
  password: string
};

const initialValues: LoginFormValues = {
  username: '',
  password: '',
};

function LoginForm() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { data: userInfo, refetch: refreshUser } = useUsersProfileRetrieve();
  const { mutate: login, isPending } = useUsersLogin({ mutation: {
    onSuccess: ({ access, refresh }) => {
      setAuthTokens({ accessToken: access, refreshToken: refresh });
      refreshUser();
    },
    onError: (e) => {
      console.error('Login failed', e);
      enqueueSnackbar(t('auth.login.error'), { variant: 'error' });
    },
  } });

  const validationSchema: Yup.ObjectSchema<LoginFormValues> = Yup.object().shape({
    username: Yup.string().required(t('auth.login.form.username_required')),
    password: Yup.string().required(t('auth.login.form.password_required')),
  });
  const yupResolver = useYupResolver(validationSchema);

  if (userInfo) return (<Navigate to="/" replace />);
  return (
    <FormContainer
      defaultValues={initialValues}
      onSuccess={(data: LoginFormValues) => login({ data })}
      resolver={yupResolver}
      disabled={isPending}
    >
      <Stack spacing={1}>
        <Typography>{ t('auth.login.description') }</Typography>
        <TextInput name="username" label={t('auth.login.form.username')} />
        <TextInput name="password" label={t('auth.login.form.password')} type="password" />
        <GameButton type="submit">{ t('auth.login.form.submit') }</GameButton>
        <DiscordLoginButton />
      </Stack>
    </FormContainer>
  );
}

export default LoginForm;
