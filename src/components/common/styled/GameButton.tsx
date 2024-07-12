import { Button, styled } from '@mui/material';

import { gameColors } from '../../../theme';

const { teal, gold } = gameColors;

type GameButtonExtraProps = {
  selected?: boolean
};

const GameButton = styled(Button)(({ selected = false }: GameButtonExtraProps) => ({
  color: teal.contrastText,
  letterSpacing: '0px',
  fontWeight: 900,
  backgroundColor: selected ? teal.light : teal.main,
  '&:hover': { backgroundColor: teal.dark },
  '&.Mui-disabled': {
    backgroundColor: teal.dark,
    color: `${teal.contrastText}99`,
  },
  textShadow: '1px 1px 1px black',
  border: '1px solid',
  borderColor: gold.light,
  outline: '1px solid',
  outlineColor: gold.dark,
}));

export default GameButton;
