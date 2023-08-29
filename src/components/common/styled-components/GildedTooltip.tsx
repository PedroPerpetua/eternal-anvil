import { Tooltip, TooltipProps, styled } from '@mui/material';

import { GAME_GOLD } from './colors';

const GildedTooltip = styled(({ className, ...props }: TooltipProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Tooltip {...props} classes={{ tooltip: className }} />
))({
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

export default GildedTooltip;
