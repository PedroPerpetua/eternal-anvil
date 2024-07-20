import { Box, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { useRealmManagerAccountsJoin, useRealmManagerAccountsList } from '../../../api/queries/realm-manager-accounts';
import { useRealmManagerGameWorldsList } from '../../../api/queries/realm-manager-game-worlds';
import GameButton from '../../common/styled/GameButton';
import useYupResolver from '../../common/useYupResolver';

type JoinAccountFormValues = {
  account: string
};

const initialValues: JoinAccountFormValues = {
  account: '',
};

function JoinAccountForm() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { queryKey: accountListQueryKey } = useRealmManagerAccountsList({ query: {
    enabled: false,
  } });
  const { queryKey: gameWorldListQueryKey } = useRealmManagerGameWorldsList({ query: {
    enabled: false,
  } });
  const { mutate: joinAccount, isPending } = useRealmManagerAccountsJoin({ mutation: {
    onSuccess: ({ id }) => {
      // Clear the account list data so it's queried on the next time
      // We do this instead of a refresh because when we navigate away the query cancels
      queryClient.removeQueries({ queryKey: accountListQueryKey, exact: true });
      queryClient.removeQueries({ queryKey: gameWorldListQueryKey, exact: true });
      navigate(`/realm-manager/${id}`);
      enqueueSnackbar(t('realmManager.account.join.form.success'), { variant: 'success' });
    },
    onError: (error) => {
      let errored = false;
      if (isAxiosError(error) && error.response) {
        error.response.data.errors.forEach((err) => {
          if (err.code === 'multi_account') {
            enqueueSnackbar(
              t('realmManager.account.join.form.errors.multiAccount'),
              { variant: 'error' },
            );
            errored = true;
          }
          if (err.code === 'not_found') {
            enqueueSnackbar(
              t('realmManager.account.join.form.errors.notFound'),
              { variant: 'error' },
            );
            errored = true;
          }
        });
      }
      if (!errored) {
        console.error('An unexpected error ocurred while joining an account', error);
        enqueueSnackbar(t('common.errors.default'), { variant: 'error' });
      }
    },
  } });

  const validationSchema: Yup.ObjectSchema<JoinAccountFormValues> = Yup.object().shape({
    account: Yup.string()
      .uuid(t('realmManager.account.join.form.account_valid'))
      .required(t('realmManager.account.join.form.account_required')),
  });
  const yupResolver = useYupResolver(validationSchema);

  return (
    <Box sx={{ paddingTop: '25px' }}>
      <FormContainer
        defaultValues={initialValues}
        onSuccess={(data) => joinAccount({ data: { id: data.account } })}
        resolver={yupResolver}
        disabled={isPending}
      >
        <Stack spacing={1} alignItems="center">
          <Typography width="100%">{ t('realmManager.account.join.description') }</Typography>
          <TextFieldElement
            name="account"
            label={t('realmManager.account.join.form.account')}
            fullWidth
            disabled={isPending}
          />
          <GameButton type="submit">{ t('realmManager.account.join.form.submit') }</GameButton>
        </Stack>
      </FormContainer>
    </Box>
  );
}

export default JoinAccountForm;
