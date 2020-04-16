import {
  DataActionConstants,
  RequestDataSourceConfigsAction,
  SetDataSourceConfigsAction,
  SetDataSourceConfigsArgs,
  RequestDataSourceConfigsArgs,
  RequestDataArgs,
  RequestDataAction,
  SetDataArgs,
  SetDataAction,
  RequestDataDictsArgs,
  RequestDataDictsAction,
  SetDataDictsArgs,
  SetDataDictsAction,
} from './types';

export function requestDataSourceConfig(
  args: RequestDataSourceConfigsArgs,
): RequestDataSourceConfigsAction {
  return {
    type: DataActionConstants.DATA_SOURCE_CONFIGS_REQUEST,
    ...args,
  };
}

export function setDataSourceConfig(
  args: SetDataSourceConfigsArgs,
): SetDataSourceConfigsAction {
  return {
    type: DataActionConstants.DATA_SOURCE_CONFIGS_SET,
    ...args,
  };
}

export function requestDataDicts(
  args: RequestDataDictsArgs,
): RequestDataDictsAction {
  return {
    type: DataActionConstants.DATA_DICTS_REQUEST,
    ...args,
  };
}

export function setDataDicts(
  args: SetDataDictsArgs,
): SetDataDictsAction {
  return {
    type: DataActionConstants.DATA_DICTS_SET,
    ...args,
  };
}

export function requestData(args: RequestDataArgs): RequestDataAction {
  return {
    type: DataActionConstants.DATA_REQUEST,
    ...args,
  };
}

export function setData(args: SetDataArgs): SetDataAction {
  return {
    type: DataActionConstants.DATA_SET,
    ...args,
  };
}
