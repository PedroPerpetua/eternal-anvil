import { Avatar, AvatarProps } from '@mui/material';

type ColoredAvatarProps = {
  color?: string,
  size?: number,
  avatarProps?: AvatarProps,
};

function ColoredAvatar({ color, size, avatarProps = {} }: ColoredAvatarProps) {
  const sizeStr = size ? `${size}px` : undefined;
  return (
    <Avatar
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...avatarProps}
      sx={{ backgroundColor: color, width: sizeStr, height: sizeStr, ...avatarProps.sx }}
    >
      { /* Fallback so the avatar comes out empty (just color) */ }
      { ' ' }
    </Avatar>
  );
}

export default ColoredAvatar;
