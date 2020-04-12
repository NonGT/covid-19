import { Action } from 'redux';

import {
  DataActionConstants,
  SetDataSourceConfigAction,
  DataState,
} from './types';

export const initialState: DataState = {
  networkStates: {
    dataSourceConfigs: {
      isRequesting: false,
    },
  },
};

export default function dataReducer(
  state = initialState,
  action: Action<DataActionConstants>,
): DataState {
  switch (action.type) {
    case DataActionConstants.DATA_SOURCE_CONFIG_REQUEST:
      return {
        ...state,
        networkStates: {
          ...state.networkStates,
          dataSourceConfigs: {
            ...state.networkStates.dataSourceConfigs,
            isRequesting: true,
          },
        },
      };
    case DataActionConstants.DATA_SOURCE_CONFIG_SET: {
      const act = (action as SetDataSourceConfigAction);
      return {
        ...state,
        networkStates: {
          ...state.networkStates,
          dataSourceConfigs: {
            isRequesting: false,
            lastError: act.error,
          },
        },
        dataSourceConfigs: (act.key && act.dataSourceConfig) ? {
          ...(state.dataSourceConfigs && state.dataSourceConfigs),
          [act.key]: act.dataSourceConfig,
        } : state.dataSourceConfigs,
      };
    }
    default:
      return state;
  }
}
