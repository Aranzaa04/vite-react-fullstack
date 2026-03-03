import { API_BASE_URL } from "../config/api";

type ApiError = { error?: string };

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = (await res.json()) as ApiError;
      msg = data?.error ? `${msg}: ${data.error}` : msg;
    } catch {
      const text = await res.text();
      if (text) msg = `${msg}: ${text}`;
    }
    throw new Error(msg);
  }

  // Por si algún endpoint regresa vacío
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}