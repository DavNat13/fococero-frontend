// .specs/tasks/draft/01-refactor-bff-connection.md
# Spec: Refactorización Frontend hacia API Gateway (BFF)

## 1. Contexto y Objetivo
El frontend debe dejar de procesar lógica pesada y orquestación de datos. Todo el tráfico se enrutará exclusivamente al `api-gateway` del backend, el cual actúa como BFF. El objetivo es adelgazar la capa de red del frontend y eliminar el código de formateo.

## 2. Archivos a Eliminar (Target: Deletion)
- `src/entities/usuario/lib/format-user.ts` -> **Motivo:** El BFF ahora devuelve el objeto User en su formato final para la UI.
- DTOs complejos en `src/features/*/api/*.dto.ts` -> **Motivo:** Simplificar a tipos base. El BFF absorbe la complejidad de mapear múltiples microservicios.

## 3. Archivos a Refactorizar (Target: Slimming)
- **`src/core/config/env.config.ts`:**
  - Eliminar referencias a URLs de terceros o servicios externos.
  - Mantener únicamente `EXPO_PUBLIC_API_GATEWAY_URL`.
- **`src/core/api/api.interceptors.ts`:**
  - Mantener la inyección del Token JWT (desde estado offline/MMKV).
  - Mantener o agregar la inyección del header `x-trace-id` para observabilidad distribuida.
  - Eliminar cualquier lógica de reintentos pesados o descifrado (esto lo hace el BFF).
- **`src/features/auth/api/auth.api.ts`:**
  - Actualizar los endpoints para apuntar a las rutas del API Gateway (ej. `/api/v1/auth/login`).
  - Reducir el manejo de errores complejos; confiar en el `ApiErrorDetail` unificado que devolverá el BFF.

## 4. Archivos Intocables (Do Not Touch)
- Toda la carpeta `src/core/offline/*` (Manejo de cola y almacenamiento local).
- Componentes visuales en `src/widgets/*` y `src/shared/ui/*`.
- Rutas de la aplicación en `app/`.

## 5. Criterios de Aceptación (Testing)
- El proyecto debe compilar sin errores de TypeScript tras las eliminaciones.
- Los tests unitarios de `auth.api.ts` deben actualizarse con mocks simples que simulen la respuesta hiper-ligera del BFF.