import { Avatar } from '@mui/material';

type ColoredAvatarProps = {
  color: string,
  size: number
};

function ColoredAvatar({ color, size }: ColoredAvatarProps) {
  const sizeStr = `${size}px`;
  return (
    <Avatar sx={{ backgroundColor: color, width: sizeStr, height: sizeStr }}>
      { /* Fallback so the avatar comes out empty (just color) */ }
      { ' ' }
    </Avatar>
  );
}

export default ColoredAvatar;
