import { RouterState } from 'connected-react-router';
import { ResourcesState } from './features/resources/types';
import { DataState } from './features/data/types';

export interface ApplicationState {
  router: RouterState;
  resources: ResourcesState;
  data: DataState;
}
