import type { CSSProperties, ComponentType } from 'react';

import MiniIconButton from './MiniIconButton';
import { gameColors } from '../../../theme';

type TealMiniIconButtonProps = {
  Icon: ComponentType<{ style: CSSProperties }>,
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
      <Icon style={{ color: gameColors.goldIcon, fontSize: size }} />
    </MiniIconButton>
  );
}

export default TealMiniIconButton;
