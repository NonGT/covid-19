import { Action } from 'redux';

import {
  DataActionConstants,
  SetDataSourceConfigsAction,
  DataState,
  SetDataDictsAction,
  SetDataAction,
} from './types';

export const initialState: DataState = {
  networkStates: {
    dataSourceConfigs: {
      isRequesting: false,
    },
    dataDicts: {
      isRequesting: false,
    },
    data: {
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
    case DataActionConstants.DATA_REQUEST:
      return {
        ...state,
        networkStates: {
          ...state.networkStates,
          data: {
            ...state.networkStates.data,
            isRequesting: true,
          },
        },
      };
    case DataActionConstants.DATA_SET: {
      const act = (action as SetDataAction);
      return {
        ...state,
        networkStates: {
          ...state.networkStates,
          data: {
            isRequesting: false,
            lastError: act.error,
          },
        },
        data: (act.key && act.data) ? {
          ...(state.data && state.data),
          [act.key]: act.data,
        } : state.data,
      };
    }
    default:
      return state;
  }
}
