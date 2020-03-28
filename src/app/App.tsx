import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import {
  withStyles,
  MuiThemeProvider,
  Box,
  WithStyles,
} from '@material-ui/core';

import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import { material } from '../theme';
import { history } from '../core';
import store from './store';

import styles from './App.styles';
import routes from './routes';
import ProgressMask from '../components/progressMask';
import NavBar from '../components/navBar';

const Dashboard = lazy(() => import('./pages/dashboard'));
const About = lazy(() => import('./pages/about'));

type Props = WithStyles<typeof styles>;

const App: React.FC<Props> = ({ classes }: Props): JSX.Element => (
  <Provider store={store}>
    <MuiThemeProvider theme={material}>
      <ConnectedRouter history={history}>
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
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
);

export default withStyles(styles, { withTheme: true })(App);
