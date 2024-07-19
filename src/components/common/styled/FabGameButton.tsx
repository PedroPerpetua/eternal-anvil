import { Fab, styled } from '@mui/material';

const FabGameButton = styled(Fab)(({ theme }) => ({
  border: '3px solid',
  borderColor: theme.palette.secondary.light,
  outline: '1px solid',
  outlineColor: theme.palette.secondary.dark,
}));

export default FabGameButton;
