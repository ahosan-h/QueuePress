const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  endpoint: string,

  options: RequestInit = {},

  token?: string,
) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      Authorization: token ? `Bearer ${token}` : "",

      ...(options.headers || {}),
    },
  });

  // HANDLE ERRORS

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
}
