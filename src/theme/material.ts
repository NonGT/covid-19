import Color from 'color';
import { createMuiTheme } from '@material-ui/core/styles';

const primary = {
  50: '#e7f7f7',
  100: '#c2eaea',
  200: '#9adddd',
  300: '#71cfcf',
  400: '#52c4c4',
  500: '#34baba',
  600: '#2fb3b3',
  700: '#27abab',
  800: '#21a3a3',
  900: '#159494',
  A100: '#c8ffff',
  A200: '#95ffff',
  A400: '#62ffff',
  A700: '#48ffff',
  contrastDefaultColor: 'dark',
};

const secondary = {
  50: '#e5e4e6',
  100: '#bebcbf',
  200: '#939095',
  300: '#68646b',
  400: '#47424b',
  500: '#27212b',
  600: '#231d26',
  700: '#1d1820',
  800: '#17141a',
  900: '#0e0b10',
  A100: '#8e56ff',
  A200: '#6c23ff',
  A400: '#5000ef',
  A700: '#4700d5',
  contrastDefaultColor: 'light',
};

export default createMuiTheme({
  palette: {
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
      'Lato',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});
