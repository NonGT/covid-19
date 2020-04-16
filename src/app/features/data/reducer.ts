import { Action } from 'redux';

import {
  DataActionConstants,
  SetDataSourceConfigsAction,
  DataState,
  SetDataDictsAction,
} from './types';

export const initialState: DataState = {
  networkStates: {
    dataSourceConfigs: {
      isRequesting: false,
    },
    dataDicts: {
      isRequesting: false,
    },
  },
};

export default function dataReducer(
  state = initialState,
  action: Action<DataActionConstants>,
): DataState {
  switch (action.type) {
    case DataActionConstants.DATA_SOURCE_CONFIGS_REQUEST:
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
    case DataActionConstants.DATA_SOURCE_CONFIGS_SET: {
      const act = (action as SetDataSourceConfigsAction);
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
    case DataActionConstants.DATA_DICTS_REQUEST:
      return {
        ...state,
        networkStates: {
          ...state.networkStates,
          dataDicts: {
            ...state.networkStates.dataDicts,
            isRequesting: true,
          },
        },
      };
    case DataActionConstants.DATA_DICTS_SET: {
      const act = (action as SetDataDictsAction);
      return {
        ...state,
        networkStates: {
          ...state.networkStates,
          dataDicts: {
            isRequesting: false,
            lastError: act.error,
          },
        },
        dataDicts: (act.key && act.dataDicts) ? {
          ...(state.dataDicts && state.dataDicts),
          [act.key]: act.dataDicts,
        } : state.dataDicts,
      };
    }
    default:
      return state;
  }
}
