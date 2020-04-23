export default interface NetworkState {
  isRequesting: boolean;
  lastError?: Error;
}

export type NetworkStates = { [prop: string]: NetworkState };
