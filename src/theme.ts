import { createTheme } from '@mui/material';

export const backgroundColor = '#9e8357';

export const gameColors = {
  teal: {
    main: '#325E54',
    light: '#5b7e76',
    dark: '#23413a',
    contrastText: '#e9dfc2',
  },
  gold: {
    main: '#745b29',
    light: '#8f7b53',
    dark: '#513f1c',
  },
  goldIcon: '#d8bc68',
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#543263',
    },
    secondary: {
      main: '#4D4351',
    },
  },
});

export default theme;
