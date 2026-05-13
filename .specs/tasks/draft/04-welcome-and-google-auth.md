// .specs/tasks/draft/04-welcome-and-google-auth.md
# Spec: Integración de API, Estado y Google Sign-In

## 1. Contexto y Objetivo
El widget de formularios ya levanta los datos correctamente, pero las páginas (`login.tsx` y `register.tsx`) carecen de lógica. El objetivo es conectar estas páginas al API Gateway (BFF) mediante el `auth.store.ts`, rediseñar la pantalla de bienvenida (`WelcomeWidget`) e integrar "Google Sign-In" usando el SDK Web de Firebase para garantizar compatibilidad total con Expo Go.

## 2. Tareas de Ejecución (Action Items)

### A. Infraestructura y Configuración (Firebase)
- Crear `src/core/config/firebase.config.ts`. Inicializar la app usando las variables `EXPO_PUBLIC_FIREBASE_*`.
- Crear el hook `useGoogleAuth.ts` en `src/features/auth/hooks/` utilizando `expo-auth-session/providers/google`.

### B. Conexión de API y Estado (Wiring)
- **Store:** Actualizar `src/features/auth/model/auth.store.ts` para que incluya los métodos asíncronos `login(credentials)` y `register(data)` que invoquen a `authApi`.
- **Páginas:** En `app/(auth)/login.tsx` y `app/(auth)/register.tsx`, conectar los eventos `onSubmit` del `AuthFormWidget` a los métodos del store.
- **Feedback y Ruteo:** Implementar manejo de estado (`isLoading`, `error`). Si la API responde exitosamente (200 OK), inyectar el JWT y ejecutar `router.replace('/(brigadista)/')`.

### C. UI: Pantalla Welcome
- Rediseñar `src/widgets/auth/ui/WelcomeWidget.tsx`.
- Usar los componentes de `@fococero/ui` para crear 3 botones claros:
  1. "Iniciar Sesión" (Rutea a `/login`).
  2. "Crear cuenta" (Rutea a `/register`).
  3. "Continuar con Google" (Ejecuta `useGoogleAuth` para obtener el token).

## 3. Criterios de Aceptación
- Un login/registro exitoso redirige al dashboard de brigadista automáticamente.
- Errores de API (ej. "Usuario no encontrado") se muestran en la UI, no crashean la app.
- El botón de Google levanta el modal de autenticación nativo de Expo Auth Session.