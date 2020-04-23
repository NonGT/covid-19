import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../../types';
import { requestResourcesIndex } from '../resources/actions';
import { ResourcesState, RequestResourcesIndexFunc } from '../resources/types';
import Root from './Root';

function mapStateToProps(state: ApplicationState): ResourcesState {
  return ({
    ...state.resources,
  });
}

type MapDispatchFuncs = { requestResourcesIndex: RequestResourcesIndexFunc };
const mapDispatchToProps = (dispatch: Dispatch): MapDispatchFuncs => bindActionCreators(
  {
    requestResourcesIndex,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Root);
