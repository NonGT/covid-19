import {
  Theme,
  createStyles,
} from '@material-ui/core';

import { StyleRules } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme): StyleRules<string> => createStyles({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
});

export default styles;
