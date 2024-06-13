import type { ComponentType } from 'react';
import type { SxProps, Theme } from '@mui/material';

import MiniIconButton from './MiniIconButton';
import { gameColors } from '../../../theme';

type TealMiniIconButtonProps = {
  Icon: ComponentType<{ sx: SxProps }>,
  size?: number
  onClick?: () => void,
  sx?: SxProps<Theme>
};

function TealMiniIconButton({ Icon, size = 16, onClick, sx }: TealMiniIconButtonProps) {
  return (
    <MiniIconButton
      primary={gameColors.teal.main}
      secondary={onClick ? gameColors.teal.dark : gameColors.teal.main}
      onClick={onClick}
      sx={sx}
    >
      <Icon sx={{ color: gameColors.goldIcon, fontSize: size }} />
    </MiniIconButton>
  );
}

export default TealMiniIconButton;
