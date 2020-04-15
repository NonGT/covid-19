import { Task } from 'redux-saga';
import {
  select,
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
import { ResourcesActionConstants, SetCountryCodeAction, ResourcesIndex } from '../resources/types';
import { requestDataSourceConfig, setDataSourceConfig, setData } from './actions';
import {
  DataSourceConfig,
  DataActionConstants,
  RequestDataSourceConfigAction,
  RequestDataAction,
  DataSourceHttpMapping,
} from './types';
import { ApplicationState } from '../../types';
import { KeyMap } from '../../../core/types/common';
import { getMappedSearchParams, getMappedResponseData } from './utils';

function* getDataSourceConfig(key: string, url: string): GeneratorEffect<DataSourceConfig, void> {
  try {
    const dataSourceConfig = (yield call(get, url)) as DataSourceConfig;
    yield put(setDataSourceConfig({ key, dataSourceConfig }));
  } catch (error) {
    yield put(setDataSourceConfig({ key, error }));
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

function* getData(
  key: string,
  url: string,
  params?: KeyMap<string, string>,
): GeneratorEffect<unknown, void> {
  try {
    const httpMapping: unknown = yield select(
      (state: ApplicationState) => !!state.data.dataSourceConfigs
        && state.data.dataSourceConfigs[key].httpMapping,
    );

    const searchParams = params && getMappedSearchParams(
      params,
      httpMapping as DataSourceHttpMapping,
    );

    const responseData: unknown = yield call(get, url, searchParams);
    const data = getMappedResponseData(
      responseData,
      httpMapping as DataSourceHttpMapping,
    );

    yield put(setData({ key, data }));
  } catch (error) {
    yield put(setData({ key, error }));
  }
}

function* dataFlow(): Generator<Effect | Task, void, Effect | Task> {
  while (true) {
    const action: unknown = yield take(DataActionConstants.DATA_REQUEST);
    const { key, url, params } = action as RequestDataAction;
    const task = yield fork(getData, key, url, params);

    yield take(DataActionConstants.DATA_SET);
    yield cancel(task as Task);
  }
}

function* countryCodeUpdatedFlow(): Generator<Effect | Task, void, Effect | Task> {
  while (true) {
    const action: unknown = yield take(ResourcesActionConstants.COUNTRY_CODE_SET);
    const { countryCode } = action as SetCountryCodeAction;

    const effectResult: unknown = yield select(
      (state: ApplicationState) => state.resources.resourcesIndex,
    );

    const resourcesIndex = effectResult as ResourcesIndex;
    const { dataSources } = resourcesIndex[countryCode] || {};

    yield all(
      dataSources.map(
        ({ key, url }) => put(requestDataSourceConfig({ key, url })),
      ),
    );
  }
}

function* resourcesDependencySaga(): Generator<AllEffect<unknown>, void, unknown> {
  yield all([
    countryCodeUpdatedFlow(),
  ]);
}

export default function* dataSaga(): Generator<AllEffect<unknown>, void, unknown> {
  yield all([
    resourcesDependencySaga(),
    dataSourceConfigFlow(),
    dataFlow(),
  ]);
}
