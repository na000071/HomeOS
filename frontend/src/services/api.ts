const API_BASE_URL = "http://localhost:5050/api";

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return undefined;
  }

  const responseText = await response.text();
  if (!responseText) {
    return undefined;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return responseText;
  }
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      typeof responseBody === "object" && responseBody !== null && "title" in responseBody
        ? String(responseBody.title)
        : typeof responseBody === "string"
          ? responseBody
          : `Request failed with status ${response.status}.`;

    throw new ApiError(response.status, response.statusText, message);
  }

  return responseBody as T;
};

export const get = <T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
  apiRequest<T>(path, { ...options, method: "GET" });

export const post = <T>(path: string, body: unknown) =>
  apiRequest<T>(path, { method: "POST", body });

export const put = <T>(path: string, body: unknown) =>
  apiRequest<T>(path, { method: "PUT", body });

export const del = <T = void>(path: string) =>
  apiRequest<T>(path, { method: "DELETE" });