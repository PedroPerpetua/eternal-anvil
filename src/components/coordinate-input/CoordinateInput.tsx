import { Typography } from '@mui/material';
import { Point } from '../../types';
import SingleCoordinateInput from './SingleCoordinateInput';


type CoordinateInputProps = {
  label: string;
  value: Point;
  setValue: (newPoint: Point) => void;
};


function CoordinateInput({ label, value, setValue }: CoordinateInputProps) {
  return (
    <>
      <Typography>{ label }</Typography>
      <SingleCoordinateInput
        label="Position X"
        adornment="X"
        value={value[0]}
        setValue={(v) => setValue([v, value[1]])}
      />
      <SingleCoordinateInput
        label="Position Y"
        adornment="Y"
        value={value[1]}
        setValue={(v) => setValue([value[0], v])}
      />
    </>
  );
}

export default CoordinateInput;
