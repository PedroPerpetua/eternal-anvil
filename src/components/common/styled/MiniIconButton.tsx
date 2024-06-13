import { IconButton, styled } from '@mui/material';

type MiniIconButtonExtraProps = {
  primary: string,
  secondary: string,
};

const MiniIconButton = styled(IconButton)(({ primary, secondary }: MiniIconButtonExtraProps) => ({
  borderRadius: '5px',
  height: '24px',
  width: '24px',
  border: '1px solid',
  backgroundColor: primary,
  borderColor: secondary,
  ':hover': {
    backgroundColor: secondary,
  },
}));

export default MiniIconButton;
