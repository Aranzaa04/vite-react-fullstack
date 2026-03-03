import { useState } from "react";
import { API_BASE_URL } from "../config/api";

type FormState = {
  nombre: string;
  email: string;
  password: string;
};

const initialForm: FormState = {
  nombre: "",
  email: "",
  password: "",
};

export default function CreateUserPage() {
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.nombre || !formData.email || !formData.password) {
      setError("Todos los campos son obligatorios.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Ingresa un email valido.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo crear el usuario.");
      }

      setSuccess("Usuario creado correctamente.");
      setFormData(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrio un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ marginTop: 0, marginBottom: 6, fontSize: 40 }}>Crear usuario</h1>
        <p style={{ margin: 0, opacity: 0.75 }}>
          Da de alta usuarios desde el panel sin cerrar tu sesion actual.
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
            Nombre completo
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Nombre del usuario"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="usuario@empresa.com"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
            Contrasena temporal
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Minimo 6 caracteres"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            />
          </label>

          {error && (
            <div
              style={{
                borderRadius: 10,
                padding: "10px 12px",
                background: "rgba(176,0,32,0.08)",
                color: "#b00020",
                fontWeight: 700,
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                borderRadius: 10,
                padding: "10px 12px",
                background: "rgba(0,128,0,0.08)",
                color: "#116611",
                fontWeight: 700,
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "#111",
              color: "#fff",
              cursor: isSubmitting ? "default" : "pointer",
              fontWeight: 800,
            }}
          >
            {isSubmitting ? "Creando..." : "Crear usuario"}
          </button>
        </form>
      </div>
    </div>
  );
}
