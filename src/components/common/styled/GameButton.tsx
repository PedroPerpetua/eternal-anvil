import { Button, styled } from '@mui/material';

const GameButton = styled(Button)(({ theme }) => ({
  letterSpacing: '0px',
  fontWeight: 900,
  textShadow: '1px 1px 1px black',
  border: '1px solid',
  borderColor: theme.palette.secondary.light,
  outline: '1px solid',
  outlineColor: theme.palette.secondary.dark,
}));

export default GameButton;
