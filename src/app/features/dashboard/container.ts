import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../../types';
import { requestResourcesIndex, requestGeoJson } from '../resources/actions';
import {
  ResourcesState,
  RequestResourcesIndexFunc,
  RequestGeoJsonFunc,
} from '../resources/types';

import Dashboard from './Dashboard';

function mapStateToProps(state: ApplicationState): ResourcesState {
  return ({
    ...state.resources,
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
