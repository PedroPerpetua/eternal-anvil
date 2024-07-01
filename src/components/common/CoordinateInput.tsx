import { Stack, Typography } from '@mui/material';

import SimpleNumberField from './SimpleNumberField';

type SingleCoordinateInputProps = {
  value: number | null,
  onChange: (value: number | null) => void,
  label: string
};

function SingleCoordinateInput({ value, onChange, label }: SingleCoordinateInputProps) {
  return (
    <SimpleNumberField
      value={value}
      onChange={onChange}
      minValue={-999}
      maxValue={999}
      textFieldProps={{
        label,
        inputProps: {
          style: { padding: '2px', textAlign: 'center' },
        },
        InputLabelProps: { shrink: true },
        sx: { width: '65px' },
      }}
    />
  );
}

type CoordinateInputProps = {
  value: [number | null, number | null],
  onChange: (value: [number | null, number | null]) => void,
};

function CoordinateInput({ value, onChange }: CoordinateInputProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" data-no-dnd="true">
      <Typography>(</Typography>
      <SingleCoordinateInput value={value[0]} onChange={(v) => onChange([v, value[1]])} label="X" />
      <Typography>|</Typography>
      <SingleCoordinateInput value={value[1]} onChange={(v) => onChange([value[0], v])} label="Y" />
      <Typography>)</Typography>
    </Stack>
  );
}

export default CoordinateInput;
