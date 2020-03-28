import { Theme, createStyles } from '@material-ui/core';
import { StyleRules } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme): StyleRules<string, {}> => createStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.primary.dark,
    height: 2000,
  },
  header: {
    height: theme.spacing(5),
    display: 'flex',
    fontSize: theme.typography.body1.fontSize,
  },
});

export default styles;
