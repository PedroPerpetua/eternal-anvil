import { Button, styled } from '@mui/material';

import { gameColors } from '../../../theme';

const { teal, gold } = gameColors;

type GameButtonExtraProps = {
  selected?: boolean
};

const GameButton = styled(Button)(({ selected = false }: GameButtonExtraProps) => ({
  color: teal.text,
  letterSpacing: '0px',
  fontWeight: 900,
  backgroundColor: selected ? teal.light : teal.main,
  '&:hover': { backgroundColor: teal.light },
  '&.Mui-disabled': { backgroundColor: teal.dark },
  textShadow: '1px 1px 1px black',
  border: '1px solid',
  borderColor: gold.light,
  outline: '1px solid',
  outlineColor: gold.dark,
}));

export default GameButton;
