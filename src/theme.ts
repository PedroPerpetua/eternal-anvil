import { createTheme } from '@mui/material';

import RouterLink from './components/common/RouterLink';

const theme = createTheme({
  palette: {
    primary: {
      main: '#543263',
      contrastText: '#e9dfc2',
    },
    secondary: {
      main: '#745b29',
      light: '#8f7b53',
      dark: '#513f1c',
      icon: '#d8bc68',
    },
    background: {
      default: '#9e8357',
    },
    teal: {
      main: '#325e54',
      light: '#5b7e76',
      dark: '#23413a',
      contrastText: '#e9dfc2',
    },
    discord: {
      main: '#5865f2',
      dark: '#4752c4',
      contrastText: 'white',
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: RouterLink,
      },
    },
    MuiButton: {
      defaultProps: {
        LinkComponent: RouterLink,
        variant: 'contained',
      },
    },
  },
});

export default theme;
