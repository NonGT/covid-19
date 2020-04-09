import React from 'react';
import { withStyles, WithStyles, Box } from '@material-ui/core';

import styles from './About.styles';

interface Props extends WithStyles<typeof styles> {
  languageCode: string;
}

const About: React.FC<Props> = ({ classes }: Props) => (
  <Box component="div" className={classes.root} />
);

export default withStyles(styles, { withTheme: true })(About);
