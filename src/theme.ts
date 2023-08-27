import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#180E07ff',
    },
    primary: {
      main: '#863594ff',
    },
    gameButtonBackground: {
      main: '#056e55',
      light: '#3e917d',
      dark: '#023027',
      contrastText: '#e9dfc2',
    },
  },
});

export default theme;
