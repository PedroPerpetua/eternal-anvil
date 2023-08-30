import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#180E07ff',
    },
    primary: {
      main: '#863594ff',
    },
  },
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'unset',
          marginRight: '10px',
        },
      },
    },
  },
});

export default theme;
