import {
  createStore,
  applyMiddleware,
  compose,
  StoreEnhancer,
} from 'redux';

import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { history } from '../core';

import reducers from './reducers';
import sagas from './sagas';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer;
  }
}

const sagaMiddleWare = createSagaMiddleware();
const initialState = {};
const enhancers: StoreEnhancer[] = [];

// This would allow us to use chrome-redux dev tool to debug our app.
if (process.env.NODE_ENV === 'development') {
  const { __REDUX_DEVTOOLS_EXTENSION__ } = window;

  if (typeof __REDUX_DEVTOOLS_EXTENSION__ === 'function') {
    enhancers.push(__REDUX_DEVTOOLS_EXTENSION__());
  }
}

const composedEnhancers = compose(
  applyMiddleware(
    routerMiddleware(history),
    sagaMiddleWare,
  ),
  enhancers[0],
);

const store = createStore(
  reducers,
  initialState,
  composedEnhancers,
);

sagaMiddleWare.run(sagas);

export default store;
