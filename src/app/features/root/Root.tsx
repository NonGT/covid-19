import React, { Suspense, lazy, useEffect } from 'react';
import {
  withStyles,
  Box,
  WithStyles,
} from '@material-ui/core';

import { Route, Switch } from 'react-router-dom';

import NetworkState from '../../../core/types/network';
import ProgressMask from '../../../components/progressMask';
import NavBar from '../../../components/navBar';
import routes from '../../routes';

import { ResourcesIndex, RequestResourcesIndexFunc } from '../resources/types';
import styles from './Root.styles';

const Dashboard = lazy(() => import('../dashboard'));
const About = lazy(() => import('../about'));

interface Props extends WithStyles<typeof styles> {
  networkStates: {
    resourcesIndex: NetworkState;
  };
  resourcesIndex?: ResourcesIndex;
  requestResourcesIndex: RequestResourcesIndexFunc;
}

const Root: React.FC<Props> = ({ classes, requestResourcesIndex }: Props) => {
  useEffect(() => {
    requestResourcesIndex();
  }, [requestResourcesIndex]);

  return (
    <Box className={classes.root}>
      <NavBar />
      <Box component="div" className={classes.root}>
        <Suspense
          fallback={(
            <ProgressMask />
          )}
        >
          <Switch>
            <Route exact path={routes.main} component={Dashboard} />
            <Route exact path={routes.about} component={About} />
          </Switch>
        </Suspense>
      </Box>
    </Box>
  );
};

export default withStyles(styles, { withTheme: true })(Root);
