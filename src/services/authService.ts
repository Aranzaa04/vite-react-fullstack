import type { LoginRequest, RegisterRequest, AuthResponse, Usuario } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL as string;
const API_BASE_URL = `${API_URL}/api`;

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error en el registro");
    }

    return response.json();
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al iniciar sesión");
    }

    return response.json();
  },

  async getMe(token: string): Promise<Usuario> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token inválido o expirado");
      }
      throw new Error("Error al obtener datos del usuario");
    }

    return response.json();
  },

  getStoredToken(): string | null {
    return localStorage.getItem("token");
  },

  setStoredToken(token: string): void {
    localStorage.setItem("token", token);
  },

  removeStoredToken(): void {
    localStorage.removeItem("token");
  },
};
