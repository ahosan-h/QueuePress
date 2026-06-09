const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4444/api";

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  headers?: HeadersInit;
  cache?: RequestCache;
};

export async function apiFetch<T>(
  endpoint: string,
  {
    method = "GET",
    body,
    token,
    headers,
    cache = "no-store",
  }: ApiFetchOptions = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    cache,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...headers,
    },
    ...(body !== undefined
      ? {
          body: JSON.stringify(body),
        }
      : {}),
  });

  // HANDLE ERRORS
  if (!response.ok) {
    let errorMessage = "Something went wrong";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  // EMPTY RESPONSE

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
