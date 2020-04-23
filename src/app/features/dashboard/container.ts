import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../../types';
import { requestResourcesIndex, requestGeoJson } from '../resources/actions';
import { requestData } from '../data/actions';
import {
  DataState,
  RequestDataFunc,
} from '../data/types';

import {
  ResourcesState,
  RequestGeoJsonFunc,
} from '../resources/types';

import Dashboard from './Dashboard';

function mapStateToProps(state: ApplicationState): ResourcesState & DataState {
  return ({
    ...state.resources,
    ...state.data,
    networkStates: {
      ...state.resources.networkStates,
      ...state.data.networkStates,
    },
  });
}

type MapDispatchFuncs = {
  requestGeoJson: RequestGeoJsonFunc;
  requestData: RequestDataFunc;
};
const mapDispatchToProps = (dispatch: Dispatch): MapDispatchFuncs => bindActionCreators(
  {
    requestResourcesIndex,
    requestGeoJson,
    requestData,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
