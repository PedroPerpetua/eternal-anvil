import { IconButton } from '@mui/material';
import type { IconButtonProps } from '@mui/material';

import XIcon from '../../../assets/x-icon.png';
import { gameColors } from '../../../theme';
import CustomIcon from '../CustomIcon';

type DeleteButtonProps = {
  xSize?: number
} & IconButtonProps;

function DeleteButton({ xSize = 12, sx, ...props }: DeleteButtonProps) {
  return (
    <IconButton
      color="error"
      sx={{
        borderRadius: '5px',
        backgroundColor: 'red',
        height: '20px',
        width: '20px',
        border: '1px solid darkred',
        ':hover': {
          backgroundColor: 'darkred',
        },
        ...sx,
      }}
      {...props}
    >
      <CustomIcon src={XIcon} tintColor={gameColors.goldIcon} size={xSize} />
    </IconButton>
  );
}

export default DeleteButton;
