import { Icon, Theme } from '@mui/material';
import type { SxProps } from '@mui/material';

import useTintedImage from './useTintedImage';

type CustomIconProps = {
  src: string,
  tintColor?: string,
  size?: 'huge' | 'large' | 'medium' | 'small' | number,
  className?: string,
  sx?: SxProps<Theme>
};

function CustomIcon({ src, tintColor, size = 'medium', className, sx }: CustomIconProps) {
  const image = useTintedImage(src, tintColor);
  let imgSize;
  if (typeof size === 'number') imgSize = size;
  else {
    switch (size) {
      case 'huge':
        imgSize = 64;
        break;
      case 'large':
        imgSize = 32;
        break;
      case 'medium':
        imgSize = 24;
        break;
      case 'small':
        imgSize = 16;
        break;
      default:
        imgSize = 0;
        break;
    }
  }

  return (
    <Icon
      fontSize={(size === 'large' || size === 'medium' || size === 'small') ? size : undefined}
      sx={{ fontSize: imgSize, ...sx }}
      className={['center-content', className].join(' ')}
    >
      <img src={image} width={imgSize} height={imgSize} alt="" draggable={false} />
    </Icon>
  );
}

export default CustomIcon;
