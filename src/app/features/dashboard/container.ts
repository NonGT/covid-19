import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../../types';
import { requestResourcesIndex, requestGeoJson } from '../resources/actions';
import { DataState } from '../data/types';
import {
  ResourcesState,
  RequestResourcesIndexFunc,
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
  requestResourcesIndex: RequestResourcesIndexFunc;
  requestGeoJson: RequestGeoJsonFunc;
};
const mapDispatchToProps = (dispatch: Dispatch): MapDispatchFuncs => bindActionCreators(
  {
    requestResourcesIndex,
    requestGeoJson,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
