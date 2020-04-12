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

import get from '../../../core/apiService';
import { GeneratorEffect } from '../../../core/types/saga';
import { setDataSourceConfig } from './actions';
import {
  DataSourceConfig,
  DataActionConstants,
  RequestDataSourceConfigAction,
} from './types';

function* getDataSourceConfig(key: string, url: string): GeneratorEffect<DataSourceConfig, void> {
  try {
    const dataSourceConfig = (yield call(get, url)) as DataSourceConfig;
    yield put(setDataSourceConfig({ dataSourceConfig }));
  } catch (error) {
    yield put(setDataSourceConfig({ error }));
  }
}

function* dataSourceConfigFlow(): Generator<Effect | Task, void, Effect | Task> {
  while (true) {
    const action: unknown = yield take(DataActionConstants.DATA_SOURCE_CONFIG_REQUEST);
    const { key, url } = action as RequestDataSourceConfigAction;
    const task = yield fork(getDataSourceConfig, key, url);

    yield take(DataActionConstants.DATA_SOURCE_CONFIG_SET);
    yield cancel(task as Task);
  }
}

export default function* resourcesSaga(): Generator<AllEffect<unknown>, void, unknown> {
  yield all([
    dataSourceConfigFlow(),
  ]);
}
