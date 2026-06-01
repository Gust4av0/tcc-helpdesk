const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export function getStoredUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function setStoredUser(user: any | null) {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
}

function buildHeaders(initHeaders?: HeadersInit, body?: any) {
  const headers = new Headers(initHeaders);

  if (!body || !(body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const init: RequestInit = {
    ...options,
    headers: buildHeaders(options.headers, options.body),
  };

  if (options.body && typeof options.body !== "string" && !(options.body instanceof FormData)) {
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      data?.erro ||
        data?.message ||
        response.statusText ||
        "Erro na requisição",
    );
  }

  return data as T;
}
