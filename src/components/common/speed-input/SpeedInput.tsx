import { TextField, Typography } from '@mui/material';

import './SpeedInput.scss';

type SpeedInputProps = {
  label: string;
  value: number;
  setValue: (newValue: number) => void;
};

function SpeedInput({ label, value, setValue }: SpeedInputProps) {
  return (
    <>
      <Typography>{ label }</Typography>
      <TextField
        label="Warlord Speed"
        type="number"
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => {
          const textValue = e.target.value;
          if (textValue === '') {
            setValue(Infinity);
            return;
          }
          const newValue = Number(textValue);
          if (Number.isInteger(newValue)) {
            setValue(newValue);
          }
        }}
        InputProps={{
          className: 'speed-input',
        }}
      />
    </>
  );
}

export default SpeedInput;
