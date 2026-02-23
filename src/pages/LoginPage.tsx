import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, error } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setLocalError("Email y contraseña son requeridos");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError("Por favor ingresa un email válido");
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    if (!isLogin && !formData.nombre) {
      setLocalError("El nombre es requerido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.nombre);
      }
      // Redirigir al dashboard después del login/registro exitoso
      navigate("/");
    } catch (err) {
      // El error ya está en el contexto
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>ShokUp</h1>
        <h2>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h2>

        {displayError && <div className="error-message">{displayError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              disabled={isSubmitting}
              autoComplete="email"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Juan Pérez"
                disabled={isSubmitting}
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••"
              disabled={isSubmitting}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>
        </form>

        <div className="toggle-auth">
          <p>
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: "", password: "", nombre: "" });
                setLocalError(null);
              }}
              disabled={isSubmitting}
              className="toggle-button"
            >
              {isLogin ? "Regístrate" : "Inicia Sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
