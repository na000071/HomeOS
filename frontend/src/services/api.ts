import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from "../types/auth";

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

const clearInvalidAuthentication = (): void => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);

  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;
  if (currentPath !== "/login" && currentPath !== "/register") {
    window.location.replace("/login");
  }
};

const getApiErrorMessage = (responseBody: unknown, status: number): string => {
  if (typeof responseBody === "string") {
    return responseBody;
  }

  if (typeof responseBody === "object" && responseBody !== null) {
    const body = responseBody as Record<string, unknown>;
    const validationErrors = body.errors;

    if (typeof validationErrors === "object" && validationErrors !== null) {
      const messages = Object.values(validationErrors)
        .flatMap((value) => Array.isArray(value) ? value : [value])
        .filter((value): value is string => typeof value === "string");

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }

    if (typeof body.detail === "string") {
      return body.detail;
    }

    if (typeof body.title === "string") {
      return body.title;
    }
  }

  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "The requested record was not found.";
  if (status >= 500) return "The server encountered an error. Please try again.";

  return `Request failed with status ${status}.`;
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
    if (!response.ok) {
      return responseText;
    }

    throw new ApiError(response.status, response.statusText, "The API returned invalid JSON.");
  }
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const isAuthenticationRequest = path === "/Auth/login" || path === "/Auth/register";
  const isMultipartBody = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isMultipartBody) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: options.body === undefined || isMultipartBody ? options.body as BodyInit | null | undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, "Network Error", "Unable to connect to HomeOS. Please check that the API is running.");
  }

  const responseBody = await parseResponseBody(response);

  if (response.status === 401) {
    if (token && !isAuthenticationRequest) {
      clearInvalidAuthentication();
      throw new ApiError(401, response.statusText, "Your session has expired. Please sign in again.");
    }

    throw new ApiError(401, response.statusText, getApiErrorMessage(responseBody, 401));
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      response.statusText,
      getApiErrorMessage(responseBody, response.status),
    );
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

export const getBlob = async (path: string): Promise<Blob> => {
  const headers = new Headers({ Accept: "*/*" });
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { headers });
  } catch {
    throw new ApiError(0, "Network Error", "Unable to connect to HomeOS. Please check that the API is running.");
  }

  if (response.status === 401) {
    clearInvalidAuthentication();
    throw new ApiError(401, response.statusText, "Your session has expired. Please sign in again.");
  }

  if (!response.ok) {
    const body = await parseResponseBody(response);
    throw new ApiError(response.status, response.statusText, getApiErrorMessage(body, response.status));
  }

  return response.blob();
};