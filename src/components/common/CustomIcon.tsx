import { Icon, SxProps, Theme } from '@mui/material';

type CustomIconProps = {
  src: string,
  size?: 'huge' | 'large' | 'medium' | 'small' | number,
  className?: string,
  sx?: SxProps<Theme>
};

function CustomIcon({ src, size = 'medium', className = '', sx = {} }: CustomIconProps) {
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
      <img src={src} width={imgSize} height={imgSize} alt="" draggable={false} />
    </Icon>
  );
}

export default CustomIcon;