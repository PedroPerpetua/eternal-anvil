import '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    tabButton: Palette['primary'];
  }
  interface PaletteOptions {
    tabButton?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsColorOverrides {
    tabButton: true;
  }
}
