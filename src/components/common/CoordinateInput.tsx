import { Stack, TextField, Typography } from '@mui/material';

import { Point } from '../../utils/math';

type SingleCoordinateInputProps = {
  value: number,
  onChange: (value: number) => void,
  label: string
};

function SingleCoordinateInput({ value, onChange, label }: SingleCoordinateInputProps) {
  const handleChange = (newValue: string) => {
    if (newValue === '') {
      onChange(Infinity);
    }
    const num = Number.parseInt(newValue, 10);
    if (num > 999 || num < -999) return; // Clamp the value
    onChange(num);
  };

  return (
    <TextField
      value={Number.isFinite(value) ? value : ''}
      onChange={(e) => handleChange(e.target.value)}
      label={label}
      type="number"
      inputProps={{
        style: { padding: '2px', textAlign: 'center' },
        className: 'disable-number-spin',
      }}
      InputLabelProps={{ shrink: true }}
      sx={{ width: '65px' }}
    />
  );
}

type CoordinateInputProps = {
  value: Point,
  onChange: (value: Point) => void,
};

function CoordinateInput({ value, onChange }: CoordinateInputProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <Typography>(</Typography>
      <SingleCoordinateInput value={value[0]} onChange={(v) => onChange([v, value[1]])} label="X" />
      <Typography>|</Typography>
      <SingleCoordinateInput value={value[1]} onChange={(v) => onChange([value[0], v])} label="Y" />
      <Typography>)</Typography>
    </Stack>
  );
}

export default CoordinateInput;
