import { Action } from 'redux';
import NetworkState from '../../../core/types/network';
import { KeyMap } from '../../../core/types/common';

export enum DataActionConstants {
  DATA_SOURCE_CONFIG_REQUEST = '@@data/DATA_SOURCE_CONFIG_REQUEST',
  DATA_SOURCE_CONFIG_SET = '@@resources/DATA_SOURCE_CONFIG_SET',
  DATA_REQUEST = '@@data/DATA_REQUEST',
  DATA_SET = '@@data/DATA_SET',
}

export interface DataConverterFunctionDef {
  func: 'split' | 'join' | 'map';
  parameters?: string[];
}

export interface DataConverter {
  input?: string;
  functionChains: DataConverterFunctionDef[];
}

export interface ObjectMemberMapping {
  name: string;
  mapping: DataMapping;
}

export interface DataMapping {
  path: string;
  type: 'number' | 'string' | 'boolean' | 'array' | 'object';
  index?: number;
  converters?: DataConverter[];
  members?: ObjectMemberMapping[];
}

export interface SearchParamsMapping {
  target: string;
  sources?: string[];
  format?: string;
  default?: string;
  converters?: DataConverter[];
}

export interface DataSourceHttpMapping {
  searchParams?: SearchParamsMapping[];
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
  key: string;
  dataSourceConfig?: DataSourceConfig;
  error?: Error;
}

export interface RequestDataArgs {
  key: string;
  url: string;
  params?: KeyMap<string, string>;
}

export interface SetDataArgs {
  key: string;
  data?: unknown;
  error?: Error;
}

export interface SummaryDataSource {
  cases: [{
    number?: number;
    age?: number;
    gender?: 'male' | 'female';
    nationality?: string;
    isolationArea?: string;
    caseArea?: string;
    announceDate?: Date;
  }];
  total: number;
}

export type RequestDataSourceConfigAction =
  RequestDataSourceConfigArgs & Action<DataActionConstants>;
export type SetDataSourceConfigAction =
  SetDataSourceConfigArgs & Action<DataActionConstants>;
export type RequestDataAction = RequestDataArgs & Action<DataActionConstants>;
export type SetDataAction =
  SetDataArgs & Action<DataActionConstants>;

export type RequestDataSourceConfigFunc =
  (args: RequestDataSourceConfigArgs) => RequestDataSourceConfigAction;

export interface DataState {
  networkStates: {
    dataSourceConfigs: NetworkState;
  };
  dataSourceConfigs?: KeyMap<string, DataSourceConfig>;
  data?: {
    summary?: SummaryDataSource;
  };
}
