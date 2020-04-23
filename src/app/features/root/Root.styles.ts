import { createStyles } from '@material-ui/core';
import { StyleRules } from '@material-ui/core/styles/withStyles';

const styles = (): StyleRules<string, {}> => createStyles({
  root: {
    minHeight: '100vh',
  },
});

export default styles;
