import { createTheme } from '@mui/material';

export const backgroundColor = '#9e8357';

export const gameColors = {
  teal: {
    main: '#285e51',
    light: '#40766c',
    dark: '#285d52',
    text: '#e9dfc2',
  },
  gold: {
    light: '#987f3c',
    dark: '#745b29',
    darker: '#3a2d14',
  },
  goldIcon: '#d8bc68',
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#863594ff',
    },
    secondary: gameColors.teal,
  },
});

export default theme;
