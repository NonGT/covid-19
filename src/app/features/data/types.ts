import { Action } from 'redux';
import NetworkState from '../../../core/types/network';
import { KeyMap } from '../../../core/types/common';

export enum DataActionConstants {
  DATA_SOURCE_CONFIGS_REQUEST = '@@data/DATA_SOURCE_CONFIGS_REQUEST',
  DATA_SOURCE_CONFIGS_SET = '@@resources/DATA_SOURCE_CONFIGS_SET',
  DATA_DICTS_REQUEST = '@@data/DATA_DICTS_REQUEST',
  DATA_DICTS_SET = '@@data/DATA_DICTS_SET',
  DATA_REQUEST = '@@data/DATA_REQUEST',
  DATA_SET = '@@data/DATA_SET',
}

export interface DataConverterFunctionDef {
  func: 'split' | 'join' | 'dict';
  params?: string[];
}

export interface DataMemberMapping {
  name: string;
  mapping: DataMapping;
}

export interface DataMapping {
  path: string;
  type: 'number' | 'string' | 'boolean' | 'array' | 'object';
  index?: number;
  converters?: DataConverterFunctionDef[];
  members?: DataMemberMapping[];
}

export interface SearchParamMapping {
  target: string;
  sources?: string[];
  format?: string;
  default?: string;
  converters?: DataConverterFunctionDef[];
}

export interface DataSourceHttpMapping {
  searchParams?: SearchParamMapping[];
  response?: DataMemberMapping[];
}

export interface DataDict {
  [keyMember: string]: KeyMap<string, unknown>;
}

export interface DataSourceConfig {
  name: string;
  method: string;
  mode?: 'cors' | 'navigate' | 'no-cors' | 'same-origin' | undefined;
  url: string;
  httpMapping: DataSourceHttpMapping;
}

export interface DataDictEntryConfig {
  dataKey: string;
  keyMembers: string[];
  valueMember?: string;
}

export interface RequestDataSourceConfigsArgs {
  key: string;
  url: string;
}

export interface SetDataSourceConfigsArgs {
  key: string;
  dataSourceConfig?: DataSourceConfig;
  error?: Error;
}

export interface RequestDataDictsArgs {
  key: string;
  url: string;
  entries: DataDictEntryConfig[];
}

export interface SetDataDictsArgs {
  key: string;
  dataDicts?: KeyMap<string, KeyMap<string, string>>;
  error?: Error;
}

export interface RequestDataArgs {
  key: string;
  params?: KeyMap<string, string>;
}

export interface SetDataArgs {
  key: string;
  data?: unknown;
  error?: Error;
}

export interface SummaryData {
  cases: [{
    number?: number;
    age?: number;
    gender?: 'male' | 'female';
    nationality?: string;
    isolationArea?: string;
    caseArea?: string;
    caseSubArea?: string;
    announceDate?: Date;
  }];
  total: number;
}

export type RequestDataSourceConfigsAction =
  RequestDataSourceConfigsArgs & Action<DataActionConstants>;
export type SetDataSourceConfigsAction =
  SetDataSourceConfigsArgs & Action<DataActionConstants>;
export type RequestDataDictsAction = RequestDataDictsArgs & Action<DataActionConstants>;
export type SetDataDictsAction = SetDataDictsArgs & Action<DataActionConstants>;
export type RequestDataAction = RequestDataArgs & Action<DataActionConstants>;
export type SetDataAction = SetDataArgs & Action<DataActionConstants>;

export type RequestDataSourceConfigsFunc =
  (args: RequestDataSourceConfigsArgs) => RequestDataSourceConfigsAction;

export type SetDataSourceConfigsFunc =
  (args: SetDataSourceConfigsArgs) => SetDataSourceConfigsAction;

export type RequestDataDictsFunc = (args: RequestDataDictsArgs) => RequestDataDictsAction;
export type SetDataDictsFunc = (args: SetDataDictsArgs) => SetDataDictsAction;
export type RequestDataFunc = (args: RequestDataArgs) => RequestDataAction;
export type SetDataFunc = (args: SetDataArgs) => SetDataAction;

export interface DataState {
  networkStates: {
    dataSourceConfigs: NetworkState;
    dataDicts: NetworkState;
    data: NetworkState;
  };
  dataSourceConfigs?: KeyMap<string, DataSourceConfig>;
  data?: {
    summary?: SummaryData;
  };
  dataDicts?: KeyMap<string, DataDict>;
}
