import { useState } from 'react';
import { TextField, TextFieldProps, Typography, TypographyProps } from '@mui/material';

type TypographyTextFieldProps = {
  value: string,
  onChange: (text: string) => void,
  editable?: boolean,
  typographyProps?: TypographyProps,
  textFieldProps?: TextFieldProps,
  editableIconSrc?: string
};

function TypographyTextField({
  value,
  onChange,
  editable = true,
  typographyProps = {},
  textFieldProps = {},
  editableIconSrc,
}: TypographyTextFieldProps) {
  const [editableState, setEditableState] = useState(false);

  if (editableState) {
    return (
      <TextField
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...textFieldProps}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (textFieldProps.onChange) textFieldProps.onChange(e);
        }}
        autoFocus
        onFocus={(e) => {
          // Bring cursor to the end
          e.target.setSelectionRange(e.target.value.length, e.target.value.length);
          if (textFieldProps.onFocus) textFieldProps.onFocus(e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') setEditableState(false);
          if (textFieldProps.onKeyDown) textFieldProps.onKeyDown(e);
        }}
        onBlur={(e) => {
          setEditableState(false);
          if (textFieldProps.onBlur) textFieldProps.onBlur(e);
        }}

      />
    );
  }

  return (
    <Typography
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...typographyProps}
      onClick={(e) => {
        if (editable) setEditableState(true);
        if (typographyProps.onClick) typographyProps.onClick(e);
      }}
      sx={{
        ':hover::after': editable && editableIconSrc ? {
          content: '\'\'',
          display: 'inline-block',
          backgroundImage: `url(${editableIconSrc})`,
          backgroundSize: '1em',
          width: '1em',
          height: '1em',
          position: 'relative',
          left: '3px',
          top: '3px',
        } : {},
        ...typographyProps.sx,
      }}
    >
      { value }
    </Typography>
  );
}

export default TypographyTextField;
