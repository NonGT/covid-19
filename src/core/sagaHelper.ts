import { select, SelectEffect } from 'redux-saga/effects';

export default class SagaHelper {
  static select<T>(selector: (s: T) => {}): SelectEffect {
    return select(selector);
  }
}
