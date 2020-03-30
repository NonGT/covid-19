import React from 'react';
import { withStyles, Box, WithStyles } from '@material-ui/core';

import styles from './Dashboard.styles';
import MapView from '../../../components/map';

interface Props extends WithStyles<typeof styles> {
  countryCode: string;
}

const Dashboard: React.FC<Props> = ({ classes }: Props) => (
  <MapView location={{ latitude: 10.8700, longitude: 100.9925 }} orbit />
);

export default withStyles(styles, { withTheme: true })(Dashboard);
