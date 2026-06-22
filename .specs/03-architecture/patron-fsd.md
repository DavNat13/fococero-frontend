# Feature-Sliced Design (FSD) en FocoCero

## Estructura de Directorios

```
src/
  app/          # Capa mas alta: layouts, routing (Expo Router), providers
  widgets/      # Componentes compuestos: combinaciones de features
  features/     # Funcionalidades de negocio: login, reportar, map-view
  entities/     # Entidades del dominio: User, Report, Alert, Emergency
  shared/       # Codigo compartido: UI kit, helpers, API client
  core/         # Capa mas baja: config, constants, axios instance, JWT utils
```

## Principio de Dependencia Unidireccional

Las capas SOLO importan desde capas inferiores. Jamas desde capas superiores.

```
app/  -->  widgets/  -->  features/  -->  entities/  -->  shared/  -->  core/
  |            |               |               |              |            |
  +------------+---------------+--------------+--------------+------------+
                             Direccion de dependencia
```

**Regla estricta**: Una capa NO puede importar desde una capa superior. Si `features/login/` necesita un componente de `app/`, ese componente debe bajar a `shared/` o `entities/`.

## Reglas para Crear Nuevos Slices

### Cuando crear un nuevo slice en `features/`

- La funcionalidad tiene un proposito de negocio unico y claramente delimitado.
- El slice anterior tiene mas de 300 lineas o mas de 5 archivos.
- La funcionalidad requiere su propio estado global (Zustand store) o queries (TanStack Query).

Ejemplos: `features/auth/` (login, registro, recuperacion), `features/report-map/` (mapa de reportes), `features/alerts/` (gestion de alertas).

### Cuando crear un nuevo slice en `entities/`

- Existe un concepto de dominio con ciclo de vida propio.
- Tiene al menos un DTO definido y validacion asociada (Zod).
- Persiste en la base de datos o se sincroniza desde el servidor.

Ejemplos: `entities/user/`, `entities/report/`, `entities/alert/`, `entities/emergency/`.

### Cuando crear un nuevo slice en `widgets/`

- Combina 2 o mas features en una unidad visual o logica cohesiva.
- Se reutiliza en varias pantallas de `app/`.

### Cuando NO crear un nuevo slice

- Si el codigo cabe en un slice existente sin superar el limite de complejidad.
- Si no hay certeza del dominio: prefiera colocar en `shared/` y refactorizar luego.

## Seguridad y JWT en FSD

- `core/` contiene la instancia de Axios con interceptores que inyectan el JWT.
- `core/` contiene las funciones de almacenamiento en SecureStore (token refresh, cache de JWT).
- `features/auth/` maneja el flujo de login/logout y gestion del estado de autenticacion via Zustand.
- `entities/user/` define el modelo de usuario que incluye el rol (RBAC).
- Los slices de negocio (`features/report-map/`) evaluan el rol del usuario desde Zustand para habilitar o deshabilitar acciones.

## Vulnerabilidades en FSD

- La separacion de capas impide que un slice comprometido acceda a logica de capas superiores.
- El interceptor centralizado en `core/` asegura que toda peticion pase por validacion JWT sin excepcion.
- El patron Result (`{ success, data, error }`) en Axios evita que errores de autenticacion se propaguen como excepciones no manejadas.

## Offline y FSD

- `entities/` contiene el Outbox para operaciones pendientes de sincronizacion.
- `features/` utiliza el sync orchestrator desde `shared/` para decidir si leer de cache o solicitar al servidor.
- `core/` proporciona el storage L1 (RAM) y L2 (AsyncStorage) con idempotency keys.
