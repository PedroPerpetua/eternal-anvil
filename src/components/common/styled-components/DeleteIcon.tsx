import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { SvgIconProps } from '@mui/material';

function DeleteIcon(props: SvgIconProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DeleteForeverIcon stroke="black" strokeWidth="1px" {...props} />;
}

export default DeleteIcon;
