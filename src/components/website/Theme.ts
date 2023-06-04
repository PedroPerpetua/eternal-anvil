import { createTheme } from '@mui/material';

/*
CSS HEX
--french-mauve: #CD68DDff;
--licorice: #180E07ff;
--mauveine: #863594ff;
--purpureus: #A73DB9ff;
--dark-purple: #2F2232ff;
*/

const Theme = createTheme({
  palette: {
    background: {
      default: '#180E07ff',
    },
    primary: {
      main: '#863594ff',
    },
  },
});

export default Theme;
