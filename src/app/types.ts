import { RouterState } from 'connected-react-router';
import { ResourcesState } from './features/resources/types';

export interface ApplicationState {
  router: RouterState;
  resources: ResourcesState;
}
