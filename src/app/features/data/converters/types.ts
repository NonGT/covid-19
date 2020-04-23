import { DataDict } from '../types';

export type ConverterFuncs = Record<string, (
  value: unknown,
  params?: string[],
  dataDicts?: Record<string, DataDict>
) => unknown>;
