import { Button, styled } from '@mui/material';

import { GAME_TEAL } from './colors';

type GameButtonExtraProps = {
  selected?: boolean
};

const GameButton = styled(Button)(({ selected = false }: GameButtonExtraProps) => ({
  color: GAME_TEAL.text,
  fontWeight: 'bold',
  backgroundColor: selected ? GAME_TEAL.light : GAME_TEAL.main,
  '&:hover': {
    backgroundColor: GAME_TEAL.light,
  },
  '&.Mui-disabled': {
    backgroundColor: GAME_TEAL.dark,
  },
}));

export default GameButton;
