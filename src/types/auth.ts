export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  creado_en: string;
  actualizado_en: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface AuthContextType {
  token: string | null;
  usuario: Usuario | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nombre: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}
