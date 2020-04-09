import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { history } from '../core';

import { ApplicationState } from './types';
import { mainReducer } from './features/main';

export default combineReducers<ApplicationState>({
  router: connectRouter(history),
  main: mainReducer,
});
