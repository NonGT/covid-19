import { query } from 'jsonpath';
import { KeyMap } from '../../../core/types/common';
import {
  DataSourceHttpMapping,
  SearchParamsMapping,
  DataConverterFunctionDef,
  DataMapping,
} from './types';

function applyConverterFuncs(value: unknown, func: DataConverterFunctionDef): unknown {
  return value;
}

function recursiveMap(data: unknown, mapping: DataMapping): unknown {
  const member = query(data, `$.${mapping.path}`);
  if (mapping.type === 'boolean') {
    return Boolean(member);
  }

  if (mapping.type === 'number') {
    return Number(member);
  }

  if (mapping.type === 'string') {
    const str = String(member);
    const { converters } = mapping;
    if (converters) {
      converters.forEach((converter) => {
        const { functionChains } = converter;
        const converted: unknown[] = [str];
        functionChains.forEach((funcChain) => {
          const convertedStr = applyConverterFuncs(converted[converted.length - 1], funcChain);
          converted.push(convertedStr);
        });

        return converted[converted.length - 1];
      });
    }

    return str;
  }

  if (mapping.type === 'object' && mapping.members) {
    return mapping.members.reduce((record, innerMember) => ({
      ...record,
      [innerMember.name]: recursiveMap(data, innerMember.mapping),
    }), {});
  }

  if (mapping.type === 'array') {
    const arrayItems = member as unknown[];
    const mappedArray = mapping.members
      ? arrayItems.map((item) => mapping.members?.reduce((record, innerMember) => ({
        ...record,
        [innerMember.name]: recursiveMap(item, innerMember.mapping),
      }), {}))
      : arrayItems;

    if (mapping.index) {
      return mappedArray[mapping.index];
    }

    return mappedArray;
  }

  return member;
}

export function mapSearchValue(
  params: KeyMap<string, string>,
  mapping: SearchParamsMapping,
): string | undefined {
  if (!mapping.sources) {
    return mapping.default;
  }

  const { sources, converters } = mapping;
  const vars: KeyMap<string, string> = sources.reduce((lookup, key) => ({
    ...lookup,
    [key]: !!params[key] && params[key],
  }), {});

  if (Object.keys(vars).length < sources.length) {
    return undefined;
  }

  if (converters) {
    converters.forEach((converter) => {
      if (!converter.input || !vars[converter.input]) {
        return;
      }

      const key = converter.input;
      const { functionChains } = converter;
      const converted: unknown[] = [vars[key]];
      functionChains.forEach((funcChain) => {
        const data = applyConverterFuncs(converted[converted.length - 1], funcChain);
        converted.push(data);
      });

      vars[key] = converted[converted.length - 1] as string;
    });
  }

  return sources.map((key: string) => params[key]).join('');
}

export function getMappedSearchParams(
  params: KeyMap<string, string>,
  httpMapping: DataSourceHttpMapping,
): URLSearchParams {
  if (!httpMapping.searchParams) {
    return new URLSearchParams(params);
  }

  const searchParams = httpMapping.searchParams.reduce((searchData, mapping) => ({
    ...searchData,
    [mapping.target]: mapSearchValue(params, mapping),
  }), {});

  return new URLSearchParams(searchParams);
}

export function getMappedResponseData(
  data: unknown,
  httpMapping: DataSourceHttpMapping,
): unknown {
  if (!httpMapping.response) {
    return data;
  }

  const mappedData = httpMapping.response.reduce((record, member) => ({
    ...record,
    [member.name]: recursiveMap(data, member.mapping),
  }), {});

  return mappedData;
}
