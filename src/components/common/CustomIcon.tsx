import { Icon, Theme } from '@mui/material';
import type { SxProps } from '@mui/material';

import useTintedImage from './useTintedImage';

type CustomIconProps = {
  src: string,
  tintColor?: string,
  size?: 'huge' | 'large' | 'medium' | 'small' | number | [number, number],
  className?: string,
  sx?: SxProps<Theme>
};

function CustomIcon({ src, tintColor, size = 'medium', className, sx }: CustomIconProps) {
  const image = useTintedImage(src, tintColor);
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
      fontSize={(size === 'large' || size === 'medium' || size === 'small') ? size : undefined}
      sx={{ fontSize: Math.max(...imgSize), ...sx }}
      className={['center-content', className].join(' ')}
    >
      <img src={image} width={imgSize[0]} height={imgSize[1]} alt="" draggable={false} />
    </Icon>
  );
}

export default CustomIcon;
