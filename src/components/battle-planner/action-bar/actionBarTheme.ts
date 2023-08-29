import { createTheme, outlinedInputClasses } from '@mui/material';

import theme from '../../../theme';
import { GAME_GOLD } from '../../common/styled-components/colors';

const actionBarTheme = createTheme(theme, {
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: GAME_GOLD.light,
          },
          '& label': {
            color: GAME_GOLD.dark,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: GAME_GOLD.light,
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: GAME_GOLD.dark,
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: GAME_GOLD.dark,
          },
          '& .MuiOutlinedInput-input': {
            color: 'white',
          },
        },
      },
    },
  },
});

export default actionBarTheme;
