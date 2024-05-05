import type { ComponentType } from 'react';
import type { SxProps } from '@mui/material';

import MiniIconButton from './MiniIconButton';
import { gameColors } from '../../../theme';

type TealMiniIconButtonProps = {
  Icon: ComponentType<{ sx: SxProps }>,
  size?: number
  onClick: () => void,
};

function TealMiniIconButton({ Icon, size = 16, onClick }: TealMiniIconButtonProps) {
  return (
    <MiniIconButton
      primary={gameColors.teal.main}
      secondary={gameColors.teal.dark}
      onClick={() => onClick()}
    >
      <Icon sx={{ color: gameColors.goldIcon, fontSize: size }} />
    </MiniIconButton>
  );
}

export default TealMiniIconButton;
