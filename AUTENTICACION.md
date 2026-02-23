# 🔐 Sistema de Autenticación - Frontend

## ¿Qué se implementó?

Se ha creado un sistema completo de autenticación con:

### 1. **AuthContext** (`src/context/AuthContext.tsx`)
- Manejo global del estado de autenticación
- Hook `useAuth()` para acceder a funciones de login/logout
- Validación automática de token al cargar la aplicación

### 2. **AuthService** (`src/services/authService.ts`)
- Servicio para llamadas a API (`/api/auth/login`, `/api/auth/register`, `/api/auth/me`)
- Manejo de token en localStorage
- Gestión de errores

### 3. **LoginPage** (`src/pages/LoginPage.tsx`)
- Página con formulario de login y registro
- Validaciones en el frontend (email, contraseña mínimo 6 caracteres)
- Mensajes de error claros
- Redirección automática al dashboard después de login exitoso

### 4. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
- Componente que protege rutas privadas
- Redirige a `/login` si no hay token válido
- Muestra "Cargando..." mientras valida el token

### 5. **AppLayout mejorado** (`src/components/AppLayout.tsx`)
- Muestra el nombre del usuario autenticado
- Botón de "Cerrar Sesión" que logout y redirige a login

## 📋 Flujo de Autenticación

```
1. Usuario ingresa a /login
2. Llena formulario (email, contraseña, nombre si es registro)
3. Se envía a API (POST /api/auth/login o /api/auth/register)
4. Backend retorna token + datos usuario
5. Se guarda token en localStorage
6. Se redirige a / (Dashboard)
7. Todas las rutas dentro de AppLayout están protegidas
8. Si token expira, se redirige a login automáticamente
```

## 🚀 Próximos Pasos

### Opción 1: Agregar token automáticamente a todas las peticiones
Crea un archivo `src/services/apiClient.ts`:

```typescript
export const apiClient = async (
  url: string,
  options?: RequestInit
) => {
  const token = localStorage.getItem('token');
  const headers = new Headers(options?.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
```

Luego úsalo en tus peticiones en lugar de `fetch`.

### Opción 2: Agregar refresh token
Si el backend lo soporta, puedes crear un endpoint `/api/auth/refresh` para renovar el token antes de que expire.

### Opción 3: Mejorar manejo de errores
Agregar un interceptor que:
- Detecte errores 401 (token expirado/inválido)
- Limpie el token automáticamente
- Rediriga a login

## 🔍 Variables de Entorno

Si necesitas cambiar la URL del backend, edita:

**Archivo:** `src/services/authService.ts`

```typescript
const API_BASE_URL = "http://localhost:3000/api";
```

Cambia `http://localhost:3000` por la URL de tu backend.

## 📝 Tipos TypeScript

Se han creado tipos en `src/types/auth.ts`:

- `Usuario` - Datos del usuario
- `LoginRequest` - Body del login
- `RegisterRequest` - Body del registro
- `AuthResponse` - Respuesta con token y usuario
- `AuthContextType` - Tipo del contexto

## 🎯 Rutas

- `/login` - Página de login/registro (pública)
- `/` - Dashboard (protegida)
- Todas las otras rutas bajo AppLayout (protegidas)

## ✅ Checklist

- [x] Página de login/registro
- [x] AuthContext con hooks
- [x] Almacenamiento de token en localStorage
- [x] Rutas protegidas
- [x] Logout con limpieza de token
- [x] Validación de token al cargar la app
- [x] Mostrar nombre de usuario en header
- [ ] (Opcional) Refresh token
- [ ] (Opcional) Interceptor de errores 401
- [ ] (Opcional) Token automático en todas las peticiones
