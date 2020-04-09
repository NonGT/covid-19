import { all, AllEffect } from 'redux-saga/effects';
import { mainSaga } from './features/main';

export default function* sagas(): Generator<AllEffect<unknown>, void, unknown> {
  yield all([
    mainSaga(),
  ]);
}
