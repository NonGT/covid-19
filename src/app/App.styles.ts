import { Theme, createStyles } from '@material-ui/core';
import { StyleRules } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme): StyleRules<string, {}> => createStyles({
  header: {
    backgroundColor: theme.palette.primary.main,
    height: theme.spacing(5),
    display: 'flex',
    fontSize: theme.typography.body1.fontSize,
  },
});

export default styles;
