import {
  Autocomplete,
  Box,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { customPenalty, penalties } from './utils';
import CustomIcon from '../common/CustomIcon';

type PenaltySelectorProps = {
  value: number | null,
  onChange: (v: number | null) => void,
};

function PenaltySelector({ value, onChange }: PenaltySelectorProps) {
  return (
    <Autocomplete
      value={value}
      onChange={(e, newValue) => onChange(newValue === null ? newValue : Number(newValue))}
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
                  { penalty.name }
                </Typography>
              </Stack>
              <Typography variant="subtitle2">{ penalty.description }</Typography>
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
            label="Mission Penalty"
            FormHelperTextProps={{ component: 'div' }}
            helperText={(
              <Stack direction="row" alignItems="center" spacing={1} component="span">
                <CustomIcon size={24} src={penalty.iconSrc} tintColor={penalty.iconColor} />
                <Typography>
                  (+
                  { currVal }
                  )
                  { ' ' }
                  { penalty.name }
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
