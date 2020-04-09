import {
  MainActionConstants,
  SetResourcesIndexArgs,
  SetResourcesIndexAction,
  RequestResourcesIndexAction,
} from './types';

export function requestResourcesIndex(): RequestResourcesIndexAction {
  return {
    type: MainActionConstants.RESOURCES_INDEX_REQUEST,
  };
}

export function setResourcesIndex(args: SetResourcesIndexArgs): SetResourcesIndexAction {
  return {
    type: MainActionConstants.RESOURCES_INDEX_SET,
    ...args,
  };
}
