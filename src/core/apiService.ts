import { KeyMap } from './types/common';

const defaultHeaders: KeyMap<string, string> = {
  'Content-Type': 'application/json',
};

export async function performRequest<T extends string | number | boolean | {} | [] | void | undefined>(
  endpoint: string,
  requestInit: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(endpoint, requestInit);
    if (!response.ok) {
      throw response;
    }

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    const refinedError = {
      status: error.status || 0,
      statusText: error.statusText || error.message,
      original: error,
    };

    throw refinedError;
  }
}

export default function get<T>(
  endpoint: string,
  queryParams?: URLSearchParams,
  options?: RequestInit,
): Promise<T> {
  const requestInit: RequestInit = {
    ...options,
    body: queryParams,
    method: 'GET',
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  return performRequest<T>(endpoint, requestInit);
}

export function post<T>(
  endpoint: string,
  body?: BodyInit,
  options?: RequestInit,
): Promise<T> {
  const requestInit: RequestInit = {
    ...options,
    body,
    method: 'POST',
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  return performRequest<T>(endpoint, requestInit);
}
