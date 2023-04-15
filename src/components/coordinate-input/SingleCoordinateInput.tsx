import { TextField, InputAdornment } from '@mui/material';
import { validateCoordinateText } from '../../utilities';


type SingleCoordinateInputProps = {
  adornment: string;
  value: number;
  setValue: (newValue: number) => void;
};

function SingleCoordinateInput({
  adornment, value, setValue,
}: SingleCoordinateInputProps) {
  return (
    <TextField
      className="single-coordinate-input"
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
      }}
    />
  );
}

export default SingleCoordinateInput;
