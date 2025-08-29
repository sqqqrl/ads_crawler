interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface FetchError extends Error {
  status?: number;
  statusText?: string;
  response?: Response;
}

export const fetchPage = async (
  url: string,
  options: FetchOptions = {}
): Promise<any> => {
  const { timeout = 10000, ...fetchOptions } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error: FetchError = new Error(
        `HTTP ${response.status}: ${response.statusText}`
      );

      error.status = response.status;
      error.statusText = response.statusText;
      error.response = response;

      console.error('Response error:', error);
      throw error;
    }

    //define type of content
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    } else if (contentType?.includes('text/')) {
      return await response.text();
    } else {
      return response.blob();
    }
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};

export const isArray = (input: unknown): input is unknown[] =>
  Array.isArray(input);
export const isString = (input: unknown): input is string =>
  typeof input === 'string' || input instanceof String;

export const isValidArray = (input: unknown): input is unknown[] =>
  isArray(input) && input.length > 0 && input.every(isString);
