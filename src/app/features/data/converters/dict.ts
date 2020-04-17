import jsonpath from 'jsonpath';
import { DataDict } from '../types';

export default function dict(
  value: unknown,
  parameters?: string[],
  dataDicts?: Record<string, DataDict>,
): string {
  const dictPath = !!parameters && parameters.length ? parameters[0] : '';
  const valueMember = !!parameters && parameters.length > 1 ? parameters[1] : undefined;

  const dicts = dataDicts && jsonpath.value(dataDicts, `$.${dictPath}`);
  if (!dicts) {
    return value as string;
  }

  const data = dicts[value as string];
  if (!data) {
    return value as string;
  }

  return valueMember ? data[valueMember] : data;
}
