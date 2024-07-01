import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

type SimpleNumberFieldProps = {
  value: number | null,
  onChange: (value: number | null) => void,
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
      onChange(null);
      return;
    }
    const num = Number.parseInt(newValue, 10);
    if (minValue && num < minValue) return;
    if (maxValue && num > maxValue) return;
    onChange(num);
  };

  return (
    <TextField
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
      onFocus={(e) => {
        e.target.select();
        if (textFieldProps.onFocus) textFieldProps.onFocus(e);
      }}
      autoComplete="off"
      data-no-dnd
    />
  );
}

export default SimpleNumberField;
