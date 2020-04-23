import { Theme, createStyles } from '@material-ui/core';
import { StyleRules } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme): StyleRules<string, {}> => createStyles({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
  summaryView: {
    width: '100vw',
    height: '100vh',
  },
});

export default styles;
