import { createTheme } from '@mui/material';

import RouterLink from './components/common/RouterLink';

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
    background: {
      default: '#9e8357',
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
      },
    },
  },
});

export default theme;
