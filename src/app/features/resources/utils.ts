import { ResourcesIndex } from './types';

export function getDefaultCountryCode(resourcesIndex: ResourcesIndex): string {
  return Object.keys(resourcesIndex)[0];
}
