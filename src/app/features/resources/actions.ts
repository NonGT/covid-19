import {
  ResourcesActionConstants,
  SetResourcesIndexArgs,
  SetResourcesIndexAction,
  RequestResourcesIndexAction,
  RequestGeoJsonArgs,
  RequestGeoJsonAction,
  SetGeoJsonArgs,
  SetGeoJsonAction,
} from './types';

export function requestResourcesIndex(): RequestResourcesIndexAction {
  return {
    type: ResourcesActionConstants.RESOURCES_INDEX_REQUEST,
  };
}

export function setResourcesIndex(args: SetResourcesIndexArgs): SetResourcesIndexAction {
  return {
    type: ResourcesActionConstants.RESOURCES_INDEX_SET,
    ...args,
  };
}

export function requestGeoJson(args: RequestGeoJsonArgs): RequestGeoJsonAction {
  return {
    type: ResourcesActionConstants.GEOJSON_REQUEST,
    ...args,
  };
}

export function setGeoJson(args: SetGeoJsonArgs): SetGeoJsonAction {
  return {
    type: ResourcesActionConstants.GEOJSON_SET,
    ...args,
  };
}
