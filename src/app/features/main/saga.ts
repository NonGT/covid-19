import { Task } from 'redux-saga';
import {
  take,
  call,
  all,
  put,
  fork,
  cancel,
  AllEffect,
  Effect,
} from 'redux-saga/effects';

import { setResourcesIndex } from './actions';
import { MainActionConstants, ResourcesIndex } from './types';
import get from '../../../core/apiService';

function* getResourcesIndex(): Generator<Effect | ResourcesIndex, void, Effect | ResourcesIndex> {
  try {
    const resourcesIndex = (yield call(get, '/resourcesIndex.json')) as ResourcesIndex;
    yield put(setResourcesIndex({ resourcesIndex }));
  } catch (error) {
    yield put(setResourcesIndex({ error }));
  }
}

function* resourcesIndexFlow(): Generator<Effect | Task, void, Effect | Task> {
  while (true) {
    yield take(MainActionConstants.RESOURCES_INDEX_REQUEST);
    const task = yield fork(getResourcesIndex);

    yield take(MainActionConstants.RESOURCES_INDEX_SET);
    yield cancel(task as Task);
  }
}

export default function* mainSaga(): Generator<AllEffect<unknown>, void, unknown> {
  yield all([
    resourcesIndexFlow(),
  ]);
}
