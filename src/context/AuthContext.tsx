import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { AuthContextType, Usuario } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay token guardado al montar el componente
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = authService.getStoredToken();
        if (storedToken) {
          // Validar que el token sea válido
          const user = await authService.getMe(storedToken);
          setToken(storedToken);
          setUsuario(user);
        }
      } catch (err) {
        // Token inválido o expirado
        authService.removeStoredToken();
        setToken(null);
        setUsuario(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login({ email, password });
      authService.setStoredToken(response.token);
      setToken(response.token);
      setUsuario(response.usuario);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, nombre: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register({ email, password, nombre });
      authService.setStoredToken(response.token);
      setToken(response.token);
      setUsuario(response.usuario);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.removeStoredToken();
    setToken(null);
    setUsuario(null);
    setError(null);
  };

  const checkAuth = async () => {
    try {
      const storedToken = authService.getStoredToken();
      if (!storedToken) {
        setToken(null);
        setUsuario(null);
        return;
      }

      const user = await authService.getMe(storedToken);
      setToken(storedToken);
      setUsuario(user);
    } catch (err) {
      authService.removeStoredToken();
      setToken(null);
      setUsuario(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    token,
    usuario,
    isLoading,
    error,
    isAuthenticated: !!token && !!usuario,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};
