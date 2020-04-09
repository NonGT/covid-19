import React from 'react';
import { Provider } from 'react-redux';
import {
  withStyles,
  MuiThemeProvider,
  WithStyles,
} from '@material-ui/core';

import { ConnectedRouter } from 'connected-react-router';

import { material } from '../theme';
import { history } from '../core';
import store from './store';
import Root from './features/root';
import styles from './App.styles';

type Props = WithStyles<typeof styles>;

const App: React.FC<Props> = ({ classes }: Props): JSX.Element => (
  <Provider store={store}>
    <MuiThemeProvider theme={material}>
      <ConnectedRouter history={history}>
        <Root />
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
);

export default withStyles(styles, { withTheme: true })(App);
