import { Stack, Typography } from '@mui/material';

import SimpleNumberField from './SimpleNumberField';
import { Point } from '../../utils/math';

type SingleCoordinateInputProps = {
  value: number,
  onChange: (value: number) => void,
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
