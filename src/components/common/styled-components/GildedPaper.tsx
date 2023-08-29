import { Paper, styled } from '@mui/material';

import { GAME_GOLD } from './colors';

const GildedPaper = styled(Paper)({
  color: 'white',
  backgroundColor: 'black',
  opacity: 0.7,
  border: '1px solid',
  borderColor: GAME_GOLD.light,
  outline: '1px solid',
  outlineColor: GAME_GOLD.dark,
  borderInline: '1px solid',
  borderInlineColor: GAME_GOLD.dark,
});

export default GildedPaper;
