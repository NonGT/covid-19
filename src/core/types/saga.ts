import { Effect } from 'redux-saga/effects';

export type GeneratorEffect<T, TReturn> = Generator<Effect | T, TReturn, Effect | T>;
