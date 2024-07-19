import '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface PaletteColor {
    icon?: string,
  }
  interface SimplePaletteColorOptions {
    icon?: string,
  }

  interface Palette {
    teal: Palette['primary'],
    discord: Palette['primary'],
  }

  interface PaletteOptions {
    teal?: PaletteOptions['primary'],
    discord?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    teal: true;
    discord: true;
  }
}
