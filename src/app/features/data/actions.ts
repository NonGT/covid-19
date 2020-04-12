import {
  DataActionConstants,
  RequestDataSourceConfigAction,
  SetDataSourceConfigAction,
  SetDataSourceConfigArgs,
} from './types';

export function requestDataSourceConfig(
  args: RequestDataSourceConfigAction,
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
