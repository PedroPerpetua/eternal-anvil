import {
  Autocomplete,
  Box,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import AddWarlordIcon from '../../assets/penalty-icons/add-warlord-icon.png';
import ConquerIcon from '../../assets/penalty-icons/conquer-icon.png';
import CustomPenaltyIcon from '../../assets/penalty-icons/custom-icon.png';
import GTIcon from '../../assets/penalty-icons/gt-icon.png';
import RaidIcon from '../../assets/penalty-icons/raid-icon.png';
import SendOnWatchIcon from '../../assets/penalty-icons/send-on-watch-icon.png';
import { gameColors } from '../../theme';
import CustomIcon from '../common/CustomIcon';

type Penalty = {
  value: number,
  name: string,
  description: string,
  iconSrc: string,
  iconColor?: string
};

const penalties: Penalty[] = [
  {
    value: 0,
    name: 'No penalty',
    description: 'Add to mission / Goblin Fort / Relic',
    iconSrc: AddWarlordIcon,
    iconColor: gameColors.goldIcon,
  },
  {
    value: 5,
    name: 'Goblin Tower',
    description: 'Raid a goblin tower',
    iconSrc: GTIcon,
  },
  {
    value: 10,
    name: 'Support',
    description: 'Send on watch / support mission',
    iconSrc: SendOnWatchIcon,
    iconColor: gameColors.goldIcon,
  },
  {
    value: 16,
    name: 'Raid',
    description: 'Raid an enemy tower',
    iconSrc: RaidIcon,
    iconColor: gameColors.goldIcon,
  },
  {
    value: 20,
    name: 'Conquer',
    description: 'Conquer an enemy tower / portal',
    iconSrc: ConquerIcon,
    iconColor: gameColors.goldIcon,
  },
];

const customPenalty: Penalty = {
  value: 0,
  name: 'Custom Penalty',
  description: '',
  iconSrc: CustomPenaltyIcon,
  iconColor: gameColors.goldIcon,
};

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
