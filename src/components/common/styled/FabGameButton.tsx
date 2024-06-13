import { Fab, styled } from '@mui/material';

import { gameColors } from '../../../theme';

const { teal, gold } = gameColors;

type FabGameButtonExtraProps = {
  selected?: boolean
};

const FabGameButton = styled(Fab)(({ selected = false }: FabGameButtonExtraProps) => ({
  color: teal.contrastText,
  letterSpacing: '0px',
  fontWeight: 900,
  backgroundColor: selected ? teal.light : teal.main,
  '&:hover': { backgroundColor: teal.light },
  '&.Mui-disabled': { backgroundColor: teal.dark },
  textShadow: '1px 1px 1px black',
  border: '3px solid',
  borderColor: gold.light,
  outline: '1px solid',
  outlineColor: gold.dark,
}));

export default FabGameButton;
