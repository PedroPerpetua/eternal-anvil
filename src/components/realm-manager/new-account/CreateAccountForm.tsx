import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { FormContainer, TextFieldElement, ToggleButtonGroupElement } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import GameWorldInput from './GameWorldInput';
import type { RaceEnum, EconomyEnum } from '../../../api/models';
import { useRealmManagerAccountsCreate, useRealmManagerAccountsList } from '../../../api/queries/realm-manager-accounts';
import { useRealmManagerGameWorldsList } from '../../../api/queries/realm-manager-game-worlds';
import CropIcon from '../../../assets/crop.png';
import DwarfIcon from '../../../assets/dwarf-banner.png';
import ElfIcon from '../../../assets/elf-banner.png';
import IronIcon from '../../../assets/iron.png';
import MultiResIcon from '../../../assets/multi-res.png';
import WoodIcon from '../../../assets/wood.png';
import CustomIcon from '../../common/CustomIcon';
import GameButton from '../../common/styled/GameButton';
import useYupResolver from '../../common/useYupResolver';

type CreateAccountFormValues = {
  gameWorld: string,
  name: string,
  race: RaceEnum,
  economy: EconomyEnum,
};

const initialValues: CreateAccountFormValues = {
  gameWorld: '',
  name: '',
  race: 'ELF',
  economy: 'MULTI',
};

function CreateAccountForm() {
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
  const { mutate: createAccount, isPending } = useRealmManagerAccountsCreate({ mutation: {
    onSuccess: ({ id }) => {
      // Clear the account list data so it's queried on the next time
      // We do this instead of a refresh because when we navigate away the query cancels
      queryClient.removeQueries({ queryKey: accountListQueryKey, exact: true });
      queryClient.removeQueries({ queryKey: gameWorldListQueryKey, exact: true });
      navigate(`/realm-manager/${id}`);
      enqueueSnackbar(t('realmManager.account.create.form.success'), { variant: 'success' });
    },
    onError: (error) => {
      let errored = false;
      if (isAxiosError(error) && error.response) {
        error.response.data.errors.forEach((err) => {
          if (err.code === 'multi_account') {
            enqueueSnackbar(
              t('realmManager.account.create.form.errors.multiAccount'),
              { variant: 'error' },
            );
            errored = true;
          }
        });
      }
      if (!errored) {
        console.error('An unexpected error ocurred while creating an account', error);
        enqueueSnackbar(t('common.errors.default'), { variant: 'error' });
      }
    },
  } });

  const validationSchema: Yup.ObjectSchema<CreateAccountFormValues> = Yup.object().shape({
    gameWorld: Yup.string().required(t('realmManager.account.create.form.gameWorld_required')),
    name: Yup.string().required(t('realmManager.account.create.form.name_required')),
    race: Yup.string().oneOf(['ELF', 'DWARF']).required(),
    economy: Yup.string().oneOf(['MULTI', 'WOOD', 'IRON', 'CROP']).required(),
  });
  const yupResolver = useYupResolver(validationSchema);

  return (
    <Box sx={{ paddingTop: '25px' }}>
      <FormContainer
        defaultValues={initialValues}
        onSuccess={(data) => createAccount({ data: {
          game_world: data.gameWorld,
          name: data.name,
          race: data.race,
          economy: data.economy,
        } })}
        resolver={yupResolver}
        disabled={isPending}
      >
        <Grid container spacing={1}>
          <Grid xs={12}>
            <GameWorldInput
              name="gameWorld"
              label={t('realmManager.account.create.form.gameWorld')}
              fullWidth
              disabled={isPending}
            />
          </Grid>
          <Grid xs={12}>
            <TextFieldElement
              name="name"
              label={t('realmManager.account.create.form.name')}
              fullWidth
              disabled={isPending}
            />
          </Grid>
          <Grid xs={12} md={6} display="flex" justifyContent="center">
            <ToggleButtonGroupElement
              name="race"
              label={t('realmManager.account.create.form.race')}
              exclusive
              enforceAtLeastOneSelected
              formLabelProps={{ sx: { textAlign: 'center' } }}
              options={[
                { id: 'ELF', label: <CustomIcon src={ElfIcon} size={48} /> },
                { id: 'DWARF', label: <CustomIcon src={DwarfIcon} size={48} /> },
              ]}
              disabled={isPending}
            />
          </Grid>
          <Grid xs={12} md={6} display="flex" justifyContent="center">
            <ToggleButtonGroupElement
              name="economy"
              label={t('realmManager.account.create.form.economy')}
              exclusive
              enforceAtLeastOneSelected
              formLabelProps={{ sx: { textAlign: 'center' } }}
              options={[
                { id: 'MULTI', label: <CustomIcon src={MultiResIcon} size={48} /> },
                { id: 'WOOD', label: <CustomIcon src={WoodIcon} size={48} /> },
                { id: 'IRON', label: <CustomIcon src={IronIcon} size={48} /> },
                { id: 'CROP', label: <CustomIcon src={CropIcon} size={48} /> },
              ]}
              disabled={isPending}
            />
          </Grid>
          <Grid xs={12} display="flex" justifyContent="center">
            <GameButton type="submit">
              { t('realmManager.account.create.form.submit') }
            </GameButton>
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
}

export default CreateAccountForm;
