// .specs/context/ARCHITECTURE.md
# ARQUITECTURA - FocoCero Frontend

## 1. Patrón FSD (Feature-Sliced Design)
El frontend se organiza en capas de dependencias unidireccionales para consumir los 7 microservicios del backend:
1. `app/`: Enrutamiento de Expo Router. Controladores de vistas.
2. `widgets/`: Orquestadores que unen UI con lógica de negocio.
3. `features/`: Hooks (`useAlertas`, `useReportes`), Stores de Zustand (`auth.store.ts`) y APIs (`auth.api.ts`).
4. `entities/`: Modelos y DTOs mapeados desde el backend.
5. `shared/`: UI genérica (`@fococero/ui`), clientes HTTP (Axios) e interceptores.
6. `core/`: Configuraciones maestras (Firebase Web SDK, MMKV offline).

## 2. Topología del API Gateway (BFF)
**REGLA DE ORO ESTRICTA PARA EL ENRUTAMIENTO:**
El API Gateway NO utiliza versionado explícito en la ruta del proxy. Todas las peticiones de Axios deben dirigirse a `/api/[microservicio]/...`. 
*Prohibido usar `/api/v1/...` a menos que el endpoint específico lo requiera internamente.*

| Microservicio | Ruta en Gateway | Estado Auth Requerido |
|---------------|-----------------|-----------------------|
| ms-auth       | `/api/auth/*`     | Mixto (Público/Privado)|
| ms-geo        | `/api/geo/*`      | Mixto |
| ms-alertas    | `/api/alertas/*`  | Firebase Token |
| ms-reportes   | `/api/reportes/*` | Firebase Token |
| ms-emergencias| `/api/emergencias/*`| Firebase Token (Solo Brigadista/Admin) |
| ms-analitica  | `/api/analitica/*`| Firebase Token (Solo Brigadista/Admin) |
| ms-multimedia | `/api/multimedia/*`| Firebase Token |

## 3. Resiliencia y Offline-First
Se debe mantener y escalar el patrón implementado en `auth.offline.ts`. Operaciones críticas de `ms-reportes` y `ms-alertas` deben encolarse en MMKV cuando el dispositivo pierda conexión, sincronizándose en background al recuperar la red.