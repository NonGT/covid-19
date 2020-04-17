import fetchJsonp from 'fetch-jsonp';

export const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

export async function jsonp<T extends string | number | boolean | {} | [] | void | undefined>(
  endpoint: string,
): Promise<T> {
  try {
    const response = await fetchJsonp(endpoint);
    if (!response.ok) {
      throw response;
    }

    return await response.json();
  } catch (error) {
    const refinedError = {
      status: error.status || 0,
      statusText: error.statusText || error.message,
      original: error,
    };

    throw refinedError;
  }
}

export async function performRequest<T extends string | number | boolean | {} | [] | void | undefined>(
  endpoint: string,
  requestInit: RequestInit,
): Promise<T> {
  try {
    if (!requestInit.headers) {
      requestInit.headers = defaultHeaders;
    }

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

export function get<T>(
  endpoint: string,
  queryParams?: URLSearchParams,
  options?: RequestInit,
): Promise<T> {
  const requestInit: RequestInit = {
    ...options,
    method: 'GET',
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  return performRequest<T>(
    `${endpoint}${queryParams ? `?${queryParams.toString()}` : ''}`,
    requestInit,
  );
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
