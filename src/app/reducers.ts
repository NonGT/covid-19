import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { history } from '../core';

import { ApplicationState } from './types';
import { resourcesReducer } from './features/resources';

export default combineReducers<ApplicationState>({
  router: connectRouter(history),
  resources: resourcesReducer,
});
