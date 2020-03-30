import {
  Theme,
  createStyles,
  easing,
  duration,
} from '@material-ui/core';

import Color from 'color';
import { StyleRules } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme): StyleRules<string> => createStyles({
  root: {
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create('all', {
      duration: duration.complex,
      easing: easing.easeOut,
    }),
    transform: 'translate(0, 0)',
  },
  rootCollapsed: {
    transform: 'translate(0, -50%)',
    backgroundColor: Color(theme.palette.primary.main).alpha(0.8).toString(),
  },
  title: {
    transition: theme.transitions.create('transform', {
      duration: duration.complex,
      easing: easing.easeOut,
    }),
    transform: 'scale(1, 1)',
    transformOrigin: 'top left',
  },
  titleCollapsed: {
    transform: 'scale(0.5, 0.5) translate(0, 150%)',
  },
});

export default styles;
