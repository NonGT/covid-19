import { Action } from 'redux';
import NetworkState from '../../../core/types/network';
import { GeoJsonFeatureCollection } from '../../../core/types/geo';
import { KeyMap } from '../../../core/types/common';

export enum ResourcesActionConstants {
  RESOURCES_INDEX_REQUEST = '@@resources/RESOURCES_INDEX_REQUEST',
  RESOURCES_INDEX_SET = '@@resources/RESOURCES_INDEX_SET',
  GEOJSON_REQUEST = '@@resources/GEOJSON_REQUEST',
  GEOJSON_SET = '@@resources/GEOJSON_SET',
  COUNTRY_CODE_SET = '@@resources/COUNTRY_CODE_SET',
}

export interface GeoJsonResourceNode {
  [key: string]: {
    url: string;
    geoNodes?: GeoJsonResourceNode;
  };
}

export interface ResourcesIndex {
  [prop: string]: {
    geoNodes: GeoJsonResourceNode;
  };
}

export interface SetResourcesIndexArgs {
  resourcesIndex?: ResourcesIndex;
  error?: Error;
}

export interface RequestGeoJsonArgs {
  key: string;
  url: string;
}

export interface SetGeoJsonArgs {
  key?: string;
  geoJson?: GeoJsonFeatureCollection;
  error?: Error;
}

export interface SetCountryCodeArgs {
  countryCode: string;
}

export type RequestResourcesIndexAction = Action<ResourcesActionConstants>;
export type SetResourcesIndexAction = SetResourcesIndexArgs & Action<ResourcesActionConstants>;
export type RequestGeoJsonAction = RequestGeoJsonArgs & Action<ResourcesActionConstants>;
export type SetGeoJsonAction = SetGeoJsonArgs & Action<ResourcesActionConstants>;
export type SetCountryCodeAction = SetCountryCodeArgs & Action<ResourcesActionConstants>;

export type RequestResourcesIndexFunc = () => RequestResourcesIndexAction;
export type SetResourcesIndexFunc = (args: SetResourcesIndexArgs) => SetResourcesIndexAction;
export type RequestGeoJsonFunc = (args: RequestGeoJsonArgs) => RequestGeoJsonAction;
export type SetGeoJsonFunc = (args: SetGeoJsonArgs) => SetGeoJsonAction;
export type SetCountryCodeFunc = (args: SetCountryCodeArgs) => SetCountryCodeAction;

export interface ResourcesState {
  networkStates: {
    resourcesIndex: NetworkState;
    geoJsons: NetworkState;
  };
  resourcesIndex?: ResourcesIndex;
  countryCode?: string;
  geoJsons?: KeyMap<string, GeoJsonFeatureCollection>;
}
