import { ApiConstants, ENDPOINT } from "./ApiConstants";

type QueryParams = Record<string, string | number | boolean>;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function buildUrlWith(endpoint: ENDPOINT): string {
  return `${ApiConstants.BASE_URL}/${ApiConstants.API}/${endpoint}`;
}

function withQuery(url: string, queryParams?: QueryParams): string {
  const query = new URLSearchParams(
    Object.entries(queryParams ?? {}).map(([key, value]) => [
      key,
      String(value),
    ]),
  ).toString();
  return query ? `${url}?${query}` : url;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(body?.error ?? response.statusText, response.status);
  }
  return body as T;
}

export function get<T>(url: string, queryParams?: QueryParams): Promise<T> {
  return request<T>(withQuery(url, queryParams));
}

export function post<T>(
  url: string,
  queryParams?: QueryParams,
  body?: unknown,
): Promise<T> {
  return request<T>(withQuery(url, queryParams), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function describeError(error: unknown): string {
  return error instanceof ApiError ? error.message : "Could not reach Sona";
}
