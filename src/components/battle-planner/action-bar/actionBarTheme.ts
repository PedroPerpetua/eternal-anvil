import { createTheme } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

import theme from '../../../theme';

const actionBarTheme = createTheme(theme, {
  palette: {
    primary: {
      main: blueGrey['500'],
      light: blueGrey['300'],
      dark: blueGrey['700'],
      contrastText: '#ffffff',
    },
    tabButton: {
      main: '#056e55',
      light: '#3e917d',
      dark: '#023027',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },
    },
  },
});

export default actionBarTheme;
