const DEFAULT_API_URL = "https://backend-aranza.vercel.app";

export const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || DEFAULT_API_URL;
export const API_BASE_URL = `${API_URL}/api`;
