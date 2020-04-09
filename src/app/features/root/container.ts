import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../../types';
import { requestResourcesIndex } from '../main/actions';
import { MainState, RequestResourcesIndexFunc } from '../main/types';
import Root from './Root';

function mapStateToProps(state: ApplicationState): MainState {
  return ({
    ...state.main,
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
