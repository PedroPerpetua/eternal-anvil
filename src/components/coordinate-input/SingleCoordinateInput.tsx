import { TextField, InputAdornment } from '@mui/material';
import { validateCoordinateText } from '../../utilities';


type SingleCoordinateInputProps = {
  label: string;
  adornment: string;
  value: number;
  setValue: (newValue: number) => void;
};

function SingleCoordinateInput({
  label, adornment, value, setValue,
}: SingleCoordinateInputProps) {
  return (
    <TextField
      className="single-coordinate-input"
      label={label}
      value={Number.isFinite(value) ? value : ''}
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
      }}
    />
  );
}

export default SingleCoordinateInput;
