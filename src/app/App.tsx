import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { withStyles, MuiThemeProvider } from '@material-ui/core';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import { material } from '../theme';
import { history } from '../core';
import store from './store';

import styles from './App.styles';

const Dashboard = lazy(() => import('./pages/dashboard'));
const About = lazy(() => import('./pages/about'));

const App = (): JSX.Element => (
  <Provider store={store}>
    <MuiThemeProvider theme={material}>
      <ConnectedRouter history={history}>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/about" component={About} />
          </Switch>
        </Suspense>
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
);

export default withStyles(styles, { withTheme: true })(App);
