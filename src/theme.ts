import { createTheme } from '@mui/material';

export const backgroundColor = '#9e8357';

export const gameColors = {
  teal: {
    main: '#285e51',
    light: '#40766c',
    dark: '#1e463d',
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
      light: '#BC56E7',
      main: '#AB1DE4',
      dark: '#9610BF',
    },
    secondary: {
      light: '#B0B0B0',
      main: '#9C9D9A',
      dark: '#5F605F',
    },
  },
});

export default theme;
