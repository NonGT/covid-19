import { Action } from 'redux';

import {
  MainActionConstants,
  SetResourcesIndexAction,
  MainState,
} from './types';

export const initialState: MainState = {
  networkStates: {
    resourcesIndex: {
      isRequesting: false,
    },
  },
};

export default function mainReducer(
  state = initialState,
  action: Action<MainActionConstants>,
): MainState {
  switch (action.type) {
    case MainActionConstants.RESOURCES_INDEX_REQUEST:
      return {
        ...state,
        networkStates: {
          ...state.networkStates,
          resourcesIndex: {
            ...state.networkStates.resourcesIndex,
            isRequesting: true,
          },
        },
      };
    case MainActionConstants.RESOURCES_INDEX_SET: {
      const act = (action as SetResourcesIndexAction);
      return {
        ...state,
        networkStates: {
          ...state.networkStates,
          resourcesIndex: {
            isRequesting: false,
            lastError: act.error,
          },
        },
        resourcesIndex: act.resourcesIndex,
        countryCode: (act.resourcesIndex
          && Object.keys(act.resourcesIndex).length
        ) ? Object.keys(act.resourcesIndex)[0] : undefined,
      };
    }
    default:
      return state;
  }
}
