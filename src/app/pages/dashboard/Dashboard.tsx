import React from 'react';
import { withStyles, Box, WithStyles } from '@material-ui/core';

import styles from './Dashboard.styles';

interface Props extends WithStyles<typeof styles> {
  countryCode: string;
}

const Dashboard: React.FC<Props> = ({ classes }: Props) => (
  <Box component="div" className={classes.root}>
    Test
  </Box>
);

export default withStyles(styles, { withTheme: true })(Dashboard);
