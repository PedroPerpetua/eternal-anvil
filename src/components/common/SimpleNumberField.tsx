import { TextField, TextFieldProps } from '@mui/material';

type SimpleNumberFieldProps = {
  value: number,
  onChange: (value: number) => void,
  minValue?: number,
  maxValue?: number,
  textFieldProps?: TextFieldProps,
};

function SimpleNumberField({
  value,
  onChange,
  minValue,
  maxValue,
  textFieldProps = {},
}: SimpleNumberFieldProps) {
  const handleChange = (newValue: string) => {
    if (newValue === '') {
      onChange(Infinity);
    }
    const num = Number.parseInt(newValue, 10);
    if (minValue && num < minValue) return;
    if (maxValue && num > maxValue) return;
    onChange(num);
  };

  return (
    <TextField
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...textFieldProps}
      type="number"
      value={Number.isFinite(value) ? value : ''}
      onChange={(e) => {
        handleChange(e.target.value);
        if (textFieldProps.onChange) textFieldProps.onChange(e);
      }}
      inputProps={{
        className: 'disable-number-spin',
        ...textFieldProps.inputProps,
      }}
      autoComplete="off"
      autoCorrect="off"
    />
  );
}

export default SimpleNumberField;
