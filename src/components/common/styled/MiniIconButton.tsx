import { forwardRef } from 'react';
import type { ComponentType } from 'react';
import { Button, styled, useTheme } from '@mui/material';
import type { ButtonProps, SxProps } from '@mui/material';

type StyledMiniIconButtonProps = {
  buttonSize?: string | number
};

const StyledMiniIconButton = styled(Button)<StyledMiniIconButtonProps>(({ buttonSize = '24px' }) => ({
  borderRadius: '5px',
  minWidth: 'unset',
  width: buttonSize,
  height: buttonSize,
  padding: 0,
}));

export type MiniIconButtonProps = ButtonProps & {
  IconComponent: ComponentType<{ sx: SxProps }>,
  iconColor?: string,
  iconSize?: number,
};

const MiniIconButton = forwardRef<HTMLButtonElement, MiniIconButtonProps>(({
  IconComponent,
  iconColor,
  iconSize = 16,
  ...props
}, ref) => {
  const theme = useTheme();
  return (
    <StyledMiniIconButton ref={ref} disableElevation {...props}>
      <IconComponent
        sx={{ color: iconColor ?? theme.palette.secondary.icon, fontSize: iconSize }}
      />
    </StyledMiniIconButton>
  );
});

export default MiniIconButton;
