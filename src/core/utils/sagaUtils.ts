import { ApplicationState } from '../../app/types';

export default function selectAs<TResult>(
  predicate: (state: ApplicationState) => TResult,
): (state: ApplicationState) => TResult {
  return predicate;
}
