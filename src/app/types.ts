import { RouterState } from 'connected-react-router';
import { MainState } from './features/main/types';

export interface ApplicationState {
  router: RouterState;
  main: MainState;
}
