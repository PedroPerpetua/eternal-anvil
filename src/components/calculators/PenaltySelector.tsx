import {
  Autocomplete,
  Box,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { customPenalty, penalties } from './utils';
import CustomIcon from '../common/CustomIcon';

type PenaltySelectorProps = {
  label: string,
  value: number | null,
  onChange: (v: number | null) => void,
};

function PenaltySelector({ label, value, onChange }: PenaltySelectorProps) {
  const { t } = useTranslation();
  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue === null ? newValue : Number(newValue))}
      freeSolo
      options={penalties.map((p) => p.value)}
      getOptionLabel={(v) => v.toString()}
      renderOption={(props, v) => {
        const penalty = penalties.find((p) => p.value === v);
        if (!penalty) return null;
        return (
          <Box component="li" {...props} key={v}>
            <Stack>
              <Stack direction="row" spacing={1}>
                <CustomIcon src={penalty.iconSrc} tintColor={penalty.iconColor} />
                <Typography variant="subtitle1">
                  (+
                  { penalty.value }
                  )
                  { ' ' }
                  { t(penalty.nameTKey) }
                </Typography>
              </Stack>
              {
                penalty.descriptionTKey && (
                  <Typography variant="subtitle2">
                    { t(penalty.descriptionTKey) }
                  </Typography>
                )
              }
            </Stack>
          </Box>
        );
      }}
      renderInput={(params) => {
        const currVal = Number(params.inputProps.value);
        const penalty = penalties.find((p) => p.value === currVal) ?? customPenalty;
        return (
          <TextField
            {...params}
            type="number"
            label={label}
            FormHelperTextProps={{ component: 'div' }}
            InputLabelProps={{ shrink: true }}
            helperText={(
              <Stack direction="row" alignItems="center" spacing={1} component="span">
                <CustomIcon size={24} src={penalty.iconSrc} tintColor={penalty.iconColor} />
                <Typography>
                  (+
                  { currVal }
                  )
                  { ' ' }
                  { t(penalty.nameTKey) }
                </Typography>
              </Stack>
            )}
          />
        );
      }}
    />
  );
}

export default PenaltySelector;
