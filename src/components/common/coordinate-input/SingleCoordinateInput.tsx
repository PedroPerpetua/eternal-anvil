import { TextField, InputAdornment } from '@mui/material';

/**
 * Validates that some text can be used as part of a coordinate. This will
 * validate that the number is an integer and that it's clamped between
 * -999 and 999.
 * @param text The text to validate.
 * @returns True if the text is a valid coordinate cell.
 */
function validateCoordinateText(text: string) {
  const number = Number(text);
  if (!Number.isInteger(number)) return false;
  if (number < -999 || number > 999) return false;
  return true;
}

type SingleCoordinateInputProps = {
  adornment: string;
  value: number;
  setValue: (newValue: number) => void;
};

function SingleCoordinateInput({ adornment, value, setValue }: SingleCoordinateInputProps) {
  return (
    <TextField
      value={Number.isFinite(value) ? value : ''}
      type="number"
      onChange={(e) => {
        const newValue = e.target.value;
        if (newValue === '') {
          setValue(Infinity);
          return;
        }
        if (validateCoordinateText(newValue)) {
          setValue(Number(newValue));
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            { adornment }
          </InputAdornment>
        ),
        className: 'single-coordinate-input',
      }}
    />
  );
}

export default SingleCoordinateInput;
