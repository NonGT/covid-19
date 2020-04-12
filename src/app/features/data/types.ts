import { Action } from 'redux';
import NetworkState from '../../../core/types/network';
import { KeyMap } from '../../../core/types/common';

export enum DataActionConstants {
  DATA_SOURCE_CONFIG_REQUEST = '@@data/DATA_SOURCE_CONFIG_REQUEST',
  DATA_SOURCE_CONFIG_SET = '@@resources/DATA_SOURCE_CONFIG_SET',
}

export interface DataConverter {
  input?: string;
  functionChains: [{
    func: 'split' | 'join' | 'map';
    parameters?: string[];
  }];
}

export interface ObjectMemberMapping {
  name: string;
  mapping: DataMapping;
}

export interface DataMapping {
  path: string;
  type: 'number' | 'string' | 'boolean' | 'array' | 'object';
  index?: number;
  converter?: DataConverter;
  members?: ObjectMemberMapping[];
}

export interface DataSourceHttpMapping {
  searchParams?: [{
    target: string;
    sources?: string[];
    default?: string;
    converters?: DataConverter;
  }];
  response?: ObjectMemberMapping[];
}

export interface DataSourceConfig {
  name: string;
  method: string;
  url: string;
  httpMapping: DataSourceHttpMapping;
}

export interface RequestDataSourceConfigArgs {
  key: string;
  url: string;
}

export interface SetDataSourceConfigArgs {
  key?: string;
  dataSourceConfig?: DataSourceConfig;
  error?: Error;
}

export type RequestDataSourceConfigAction =
  RequestDataSourceConfigArgs & Action<DataActionConstants>;
export type SetDataSourceConfigAction =
  SetDataSourceConfigArgs & Action<DataActionConstants>;

export type RequestDataSourceConfigFunc =
  (args: RequestDataSourceConfigArgs) => RequestDataSourceConfigAction;

export interface DataState {
  networkStates: {
    dataSourceConfigs: NetworkState;
  };
  dataSourceConfigs?: KeyMap<string, DataSourceConfig>;
}
