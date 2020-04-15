import {
  DataActionConstants,
  RequestDataSourceConfigAction,
  SetDataSourceConfigAction,
  SetDataSourceConfigArgs,
  RequestDataSourceConfigArgs,
  RequestDataArgs,
  RequestDataAction,
  SetDataArgs,
  SetDataAction,
} from './types';

export function requestDataSourceConfig(
  args: RequestDataSourceConfigArgs,
): RequestDataSourceConfigAction {
  return {
    type: DataActionConstants.DATA_SOURCE_CONFIG_REQUEST,
    ...args,
  };
}

export function setDataSourceConfig(
  args: SetDataSourceConfigArgs,
): SetDataSourceConfigAction {
  return {
    type: DataActionConstants.DATA_SOURCE_CONFIG_SET,
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
