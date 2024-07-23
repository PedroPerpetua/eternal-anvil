import { Button, styled } from '@mui/material';

type GameButtonExtraProps = {
  selected?: boolean,
};

const GameButton = styled(Button)<GameButtonExtraProps>(({ theme, color = 'primary', selected }) => ({
  letterSpacing: '0px',
  fontWeight: 900,
  textShadow: '1px 1px 1px black',
  border: '1px solid',
  borderColor: theme.palette.secondary.light,
  outline: '1px solid',
  outlineColor: theme.palette.secondary.dark,
  ...selected !== undefined && {
    ...selected
      ? {
        backgroundColor: theme.palette[color && color !== 'inherit' ? color : 'primary'].dark,
      }
      : {
        borderColor: theme.palette[color && color !== 'inherit' ? color : 'primary'].main,
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
        '&:active': { boxShadow: 'none' },
        '&.disabled': { boxShadow: 'none' },
      },
  },
}));

export default GameButton;
