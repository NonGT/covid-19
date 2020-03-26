import React from 'react';
import { withStyles, Box, WithStyles } from '@material-ui/core';

import styles from './ProgressMask.styles';

type Props = WithStyles<typeof styles>;

const ProgressMask: React.FC<Props> = ({ classes }: Props) => (
  <Box component="div" className={classes.root}>
    Loading
  </Box>
);

export default withStyles(styles, { withTheme: true })(ProgressMask);
