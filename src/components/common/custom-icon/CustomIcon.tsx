import { Icon } from '@mui/material';

type CustomIconProps = {
  src: string,
  size?: 'large' | 'medium' | 'small',
  className?: string
};

function CustomIcon({ src, size = 'medium', className = '' }: CustomIconProps) {
  let imgSize;
  switch (size) {
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
  return (
    <Icon fontSize={size} className={['center-content', className].join(' ')}>
      <img src={src} width={imgSize} height={imgSize} alt="" className="no-drag" />
    </Icon>
  );
}

export default CustomIcon;
