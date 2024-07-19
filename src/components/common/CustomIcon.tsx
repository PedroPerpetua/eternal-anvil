import { Icon } from '@mui/material';
import type { IconProps } from '@mui/material';

import useTintedImage from './useTintedImage';

export type CustomIconProps = Omit<IconProps, 'fontSize'> & {
  src: string,
  size?: 'huge' | 'large' | 'medium' | 'small' | number | [number, number]
};

function CustomIcon({ src, size = 'medium', sx, ...props }: CustomIconProps) {
  // @ts-ignore - it does exist
  const image = useTintedImage(src, sx?.color);
  let imgSize;
  if (typeof size === 'number') imgSize = [size, size];
  else if (typeof size === 'string') {
    switch (size) {
      case 'huge':
        imgSize = [64, 64];
        break;
      case 'large':
        imgSize = [32, 32];
        break;
      case 'medium':
        imgSize = [24, 24];
        break;
      case 'small':
        imgSize = [16, 16];
        break;
      default:
        imgSize = [0, 0];
        break;
    }
  } else imgSize = size;

  return (
    <Icon
      {...props}
      fontSize={(size === 'large' || size === 'medium' || size === 'small') ? size : undefined}
      sx={{
        fontSize: Math.max(...imgSize),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <img src={image} width={imgSize[0]} height={imgSize[1]} alt="" draggable={false} />
    </Icon>
  );
}

export default CustomIcon;
