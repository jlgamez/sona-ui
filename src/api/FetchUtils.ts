import { ApiConstants, ENDPOINT } from "./ApiConstants";

export function buildUrlWith(endpoint: ENDPOINT): string {
  console.log(`${ApiConstants.BASE_URL}/${ApiConstants.API}/${endpoint}`);
  return `${ApiConstants.BASE_URL}/${ApiConstants.API}/${endpoint}`;
}

export async function get<T>(
  url: string,
  queryParams?: Record<string, string | number | boolean>,
): Promise<T> {
  const params = new URLSearchParams();
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      params.append(key, String(value));
    });
  }
  const fullEndpoint = params.toString() ? `${url}?${params}` : url;
  const response = await fetch(fullEndpoint);
  return response.json();
}

export async function post<T>(
  url: string,
  queryParams?: Record<string, string | number | boolean>,
  body?: unknown,
): Promise<T> {
  const params = new URLSearchParams();
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      params.append(key, String(value));
    });
  }
  const fullEndpoint = params.toString() ? `${url}?${params}` : url;
  const response = await fetch(fullEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return response.json();
}
