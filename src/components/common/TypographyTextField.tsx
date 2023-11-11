import { useEffect, useState } from 'react';
import { TextField, TextFieldProps, Typography, TypographyProps } from '@mui/material';

type TypographyTextFieldProps = {
  value: string,
  onChange: (text: string) => void,
  editable?: boolean,
  doubleClickOnly?: boolean,
  editableIconSrc?: string,
  valueIfEmpty?: string,
  typographyProps?: TypographyProps,
  textFieldProps?: TextFieldProps,
};

function TypographyTextField({
  value,
  onChange,
  editable = true,
  doubleClickOnly = false,
  editableIconSrc,
  valueIfEmpty,
  typographyProps = {},
  textFieldProps = {},
}: TypographyTextFieldProps) {
  const [editableState, setEditableState] = useState(false);

  useEffect(() => {
    if (valueIfEmpty && value === '') onChange(valueIfEmpty);
    // Only run this on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          if (e.key === 'Enter' || e.key === 'Escape') {
            setEditableState(false);
            if (valueIfEmpty && value === '') onChange(valueIfEmpty);
          }
          if (textFieldProps.onKeyDown) textFieldProps.onKeyDown(e);
        }}
        onBlur={(e) => {
          setEditableState(false);
          if (valueIfEmpty && value === '') onChange(valueIfEmpty);
          if (textFieldProps.onBlur) textFieldProps.onBlur(e);
        }}
        inputRef={(input: HTMLInputElement) => {
          if (input) input.select();
          if (textFieldProps.inputRef) {
            if (typeof textFieldProps.inputRef === 'function') textFieldProps.inputRef(input);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            else textFieldProps.inputRef.current = input;
          }
        }}
      />
    );
  }

  return (
    <Typography
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...typographyProps}
      onClick={(e) => {
        if (editable && !doubleClickOnly) setEditableState(true);
        if (typographyProps.onClick) typographyProps.onClick(e);
      }}
      onDoubleClick={(e) => {
        if (editable && doubleClickOnly) setEditableState(true);
        if (typographyProps.onDoubleClick) typographyProps.onDoubleClick(e);
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
