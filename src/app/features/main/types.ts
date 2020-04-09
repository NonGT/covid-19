import { Action } from 'redux';
import NetworkState from '../../../core/types/network';

export enum MainActionConstants {
  RESOURCES_INDEX_REQUEST = '@@main/RESOURCES_INDEX_REQUEST',
  RESOURCES_INDEX_SET = '@@main/RESOURCES_INDEX_SET',
}

export interface ResourcesIndex {
  [prop: string]: {
    geojson: {
      overview: string;
      level0?: {
        [key: string]: string;
      };
    };
  };
}

export interface SetResourcesIndexArgs {
  resourcesIndex?: ResourcesIndex;
  error?: Error;
}

export type RequestResourcesIndexAction = Action<MainActionConstants>;
export type RequestGeojsonAction = Action<MainActionConstants>;
export type SetResourcesIndexAction = SetResourcesIndexArgs & Action<MainActionConstants>;

export type RequestResourcesIndexFunc = () => RequestResourcesIndexAction;
export type RequestGeojsonFunc = () => RequestGeojsonAction;
export type SetResourcesIndexFunc = (args: SetResourcesIndexArgs) => SetResourcesIndexAction;

export interface MainState {
  networkStates: {
    resourcesIndex: NetworkState;
  };
  resourcesIndex?: ResourcesIndex;
  countryCode?: string;
}
