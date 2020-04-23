import { Task } from 'redux-saga';
import {
  take,
  call,
  all,
  put,
  fork,
  select,
  cancel,
  AllEffect,
  Effect,
} from 'redux-saga/effects';

import { get } from '../../../core/apiService';
import { GeneratorEffect } from '../../../core/types/saga';
import { GeoJsonFeatureCollection } from '../../../core/types/geo';
import {
  setResourcesIndex,
  setGeoJson,
  setCountryCode,
  requestGeoJson,
} from './actions';

import {
  ResourcesActionConstants,
  ResourcesIndex,
  RequestGeoJsonAction,
  SetResourcesIndexAction,
  SetCountryCodeAction,
} from './types';
import { getDefaultCountryCode } from './utils';
import { ApplicationState } from '../../types';

function* getResourcesIndex(): GeneratorEffect<ResourcesIndex, void> {
  try {
    const resourcesIndex = (yield call(get, '/resourcesIndex.json')) as ResourcesIndex;
    yield put(setResourcesIndex({ resourcesIndex }));
  } catch (error) {
    yield put(setResourcesIndex({ error }));
  }
}

function* resourcesIndexFlow(): Generator<Effect | Task, void, Effect | Task> {
  while (true) {
    yield take(ResourcesActionConstants.RESOURCES_INDEX_REQUEST);
    const task = yield fork(getResourcesIndex);

    const action: unknown = yield take(ResourcesActionConstants.RESOURCES_INDEX_SET);
    yield cancel(task as Task);

    const { resourcesIndex, error } = (action as SetResourcesIndexAction);
    if (!error && resourcesIndex) {
      const countryCode = getDefaultCountryCode(resourcesIndex);
      yield put(setCountryCode({ countryCode }));
    }
  }
}

function* getGeoJson(key: string, url: string): GeneratorEffect<GeoJsonFeatureCollection, void> {
  try {
    const geoJson = (yield call(get, url)) as GeoJsonFeatureCollection;
    yield put(setGeoJson({ key, geoJson }));
  } catch (error) {
    yield put(setGeoJson({ error }));
  }
}

function* geoJsonFlow(): Generator<Effect | Task, void, Effect | Task> {
  while (true) {
    const action: unknown = yield take(ResourcesActionConstants.GEOJSON_REQUEST);
    const { key, url } = action as RequestGeoJsonAction;
    const task = yield fork(getGeoJson, key, url);

    yield take(ResourcesActionConstants.GEOJSON_SET);
    yield cancel(task as Task);
  }
}

function* countryCodeUpdatedFlow(): Generator<Effect | Task, void, Effect | Task> {
  while (true) {
    const action: unknown = yield take(ResourcesActionConstants.COUNTRY_CODE_SET);
    const { countryCode } = action as SetCountryCodeAction;

    const effect: unknown = yield select(
      (state: ApplicationState) => state.resources.resourcesIndex,
    );

    const resourcesIndex = effect as ResourcesIndex;

    const { geoNodes } = resourcesIndex[countryCode] || {};
    const { url } = (geoNodes && geoNodes.root) || {};
    yield put(requestGeoJson({ key: countryCode, url }));
  }
}

function* dependencySaga(): Generator<AllEffect<unknown>, void, unknown> {
  yield all([
    countryCodeUpdatedFlow(),
  ]);
}

export default function* resourcesSaga(): Generator<AllEffect<unknown>, void, unknown> {
  yield all([
    resourcesIndexFlow(),
    geoJsonFlow(),
    dependencySaga(),
  ]);
}
