import jsonpath from 'jsonpath';
import { KeyMap } from '../../../core/types/common';
import {
  DataSourceHttpMapping,
  SearchParamMapping,
  DataConverterFunctionDef,
  DataMapping,
  DataDict,
} from './types';

import * as converterFuncs from './converters';
import { ConverterFuncs } from './converters/types';

function applyConverterFuncs(
  value: unknown,
  def: DataConverterFunctionDef,
  dataDicts?: Record<string, DataDict>,
): unknown {
  const funcs = converterFuncs as ConverterFuncs;
  return funcs[def.func](value, def.params, dataDicts);
}

function processConvertion(
  value: unknown,
  converters: DataConverterFunctionDef[],
  dataDicts?: Record<string, DataDict>,
): unknown {
  const converted: unknown[] = [value];
  converters.forEach((converter) => {
    const convertedStr = applyConverterFuncs(
      converted[converted.length - 1],
      converter,
      dataDicts,
    );

    converted.push(convertedStr);
  });

  return converted[converted.length - 1];
}

function isPrimitiveType(type: string): boolean {
  return ['boolean', 'number', 'string'].includes(type);
}

function primitiveConvert(value: unknown, type: string): unknown {
  if (type === 'boolean') {
    return Boolean(value);
  }

  if (type === 'number') {
    return Number(value);
  }

  if (type === 'string') {
    return String(value);
  }

  return value;
}

function refineMappingPath(path: string): string {
  return path
    .split('.')
    .map((str) => (str.includes(' ') ? `['${str}']` : `.${str}`))
    .join('');
}

function recursiveMap(
  data: unknown,
  mapping: DataMapping,
  dataDicts?: Record<string, DataDict>,
): unknown {
  const member = jsonpath.value(data, `$${refineMappingPath(mapping.path)}`);

  if (!mapping.type || isPrimitiveType(mapping.type)) {
    const value = primitiveConvert(member, mapping.type);

    const { converters } = mapping;
    if (converters) {
      return processConvertion(value, converters, dataDicts);
    }

    return value;
  }

  if (mapping.type === 'object' && mapping.members) {
    return mapping.members.reduce((record, innerMember) => ({
      ...record,
      [innerMember.name]: recursiveMap(data, innerMember.mapping, dataDicts),
    }), {});
  }

  if (mapping.type === 'array') {
    const arrayItems = member as unknown[];
    const mappedArray = mapping.members
      ? arrayItems.map((item) => mapping.members?.reduce((record, innerMember) => ({
        ...record,
        [innerMember.name]: recursiveMap(item, innerMember.mapping, dataDicts),
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
  mapping: SearchParamMapping,
  params?: KeyMap<string, string>,
  dataDicts?: Record<string, DataDict>,
): string | undefined {
  if (!mapping.sources) {
    return mapping.default;
  }

  const { sources, converters } = mapping;
  const vars: KeyMap<string, string> = sources.reduce((lookup, key) => ({
    ...lookup,
    [key]: !!params && !!params[key] ? params[key] : undefined,
  }), {});

  if (converters) {
    Object.keys(vars).forEach((key) => {
      vars[key] = processConvertion(vars[key], converters, dataDicts) as string;
    });
  }

  if (mapping.format) {
    return Object.keys(vars).reduce(
      (replaced, key) => replaced.replace(`${key}`, vars[key]),
      mapping.format,
    );
  }

  const mappedValues = sources
    .filter((key: string) => vars[key])
    .map((key: string) => vars[key]);

  if (mappedValues.length === 0) {
    return undefined;
  }

  return mappedValues.join(',');
}

export function getMappedSearchParams(
  httpMapping: DataSourceHttpMapping,
  params?: KeyMap<string, string>,
  dataDicts?: Record<string, DataDict>,
): URLSearchParams {
  if (!httpMapping.searchParams) {
    return new URLSearchParams(params);
  }

  const searchParams = httpMapping.searchParams
    .map((mapping) => ({
      target: mapping.target,
      value: mapSearchValue(mapping, params, dataDicts),
    }))
    .filter((mapped) => mapped.value)
    .reduce((searchData, mapped) => ({
      ...searchData,
      [mapped.target]: mapped.value,
    }), {});

  return new URLSearchParams(searchParams);
}

export function getMappedResponseData(
  data: unknown,
  httpMapping: DataSourceHttpMapping,
  dataDicts?: Record<string, DataDict>,
): unknown {
  if (!httpMapping.response) {
    return data;
  }

  const mappedData = httpMapping.response.reduce((record, member) => ({
    ...record,
    [member.name]: recursiveMap(data, member.mapping, dataDicts),
  }), {});

  return mappedData;
}
