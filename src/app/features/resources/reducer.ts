import { Action } from 'redux';

import {
  ResourcesActionConstants,
  SetResourcesIndexAction,
  ResourcesState,
  SetGeoJsonAction,
} from './types';

export const initialState: ResourcesState = {
  networkStates: {
    resourcesIndex: {
      isRequesting: false,
    },
    geoJsons: {
      isRequesting: false,
    },
  },
};

export default function resourcesReducer(
  state = initialState,
  action: Action<ResourcesActionConstants>,
): ResourcesState {
  switch (action.type) {
    case ResourcesActionConstants.RESOURCES_INDEX_REQUEST:
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
    case ResourcesActionConstants.RESOURCES_INDEX_SET: {
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
    case ResourcesActionConstants.GEOJSON_REQUEST:
      return {
        ...state,
        networkStates: {
          ...state.networkStates,
          geoJsons: {
            ...state.networkStates.geoJsons,
            isRequesting: true,
          },
        },
      };
    case ResourcesActionConstants.GEOJSON_SET: {
      const act = (action as SetGeoJsonAction);
      return {
        ...state,
        networkStates: {
          ...state.networkStates,
          geoJsons: {
            isRequesting: false,
            lastError: act.error,
          },
        },
        geoJsons: (act.key && act.geoJson) ? {
          ...(state.geoJsons && state.geoJsons),
          [act.key]: act.geoJson,
        } : state.geoJsons,
      };
    }
    default:
      return state;
  }
}
