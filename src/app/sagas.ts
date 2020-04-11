import { all, AllEffect } from 'redux-saga/effects';
import { resourcesSaga } from './features/resources';

export default function* sagas(): Generator<AllEffect<unknown>, void, unknown> {
  yield all([
    resourcesSaga(),
  ]);
}
