import Color from 'color';
import { createMuiTheme } from '@material-ui/core/styles';

import palette from './palette.module.css';

const primary = {
  50: palette.primary50,
  100: palette.primary100,
  200: palette.primary200,
  300: palette.primary300,
  400: palette.primary400,
  500: palette.primary500,
  600: palette.primary600,
  700: palette.primary700,
  800: palette.primary800,
  900: palette.primary900,
  A100: palette.primaryA100,
  A200: palette.primaryA200,
  A400: palette.primaryA400,
  A700: palette.primaryA700,
  contrastDefaultColor: 'light',
};

const secondary = {
  50: palette.secondary50,
  100: palette.secondary100,
  200: palette.secondary200,
  300: palette.secondary300,
  400: palette.secondary400,
  500: palette.secondary500,
  600: palette.secondary600,
  700: palette.secondary700,
  800: palette.secondary800,
  900: palette.secondary900,
  A100: palette.secondaryA100,
  A200: palette.secondaryA200,
  A400: palette.secondaryA400,
  A700: palette.secondaryA700,
  contrastDefaultColor: 'dark',
};

export default createMuiTheme({
  palette: {
    background: {
      default: primary[700],
    },
    primary: {
      ...primary,
      light: primary[300],
      main: primary[500],
      dark: primary[700],
    },
    secondary: {
      ...secondary,
      light: secondary[300],
      main: secondary[500],
      dark: secondary[700],
    },
    common: {
      white: Color('#fff').alpha(0.8).toString(),
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(0, 0, 0, 0.14)',
      disabled: 'rgba(0, 0, 0, 0.3)',
      disabledBackground: primary[50],
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Segoe UI',
      'sans-serif',
    ].join(','),
  },
});
