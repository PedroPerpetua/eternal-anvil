import '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    gameButtonBackground: Palette['primary'];
  }
  interface PaletteOptions {
    gameButtonBackground?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsColorOverrides {
    gameButtonBackground: true;
  }
}
