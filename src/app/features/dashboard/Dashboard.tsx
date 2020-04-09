import React from 'react';
import { connect } from 'react-redux';
import { withStyles, WithStyles, Box } from '@material-ui/core';

import Summary from '../../../components/summary';
import NetworkState from '../../../core/types/network';
import { ApplicationState } from '../../types';
import { ResourcesIndex } from '../main/types';
import styles from './Dashboard.styles';

interface Props extends WithStyles<typeof styles> {
  networkStates: {
    resourcesIndex: NetworkState;
  };
  resourcesIndex?: ResourcesIndex;
}

const Dashboard: React.FC<Props> = ({ classes, resourcesIndex }: Props) => (
  <Box className={classes.root}>
    {resourcesIndex && (
      <Summary
        classes={{
          root: classes.summaryView,
        }}
        countryCode={Object.keys(resourcesIndex)[0]}
      />
    )}
  </Box>
);

const styledComponent = withStyles(styles, { withTheme: true })(Dashboard);
export default connect((state: ApplicationState) => ({
  ...state.main,
}))(styledComponent);
