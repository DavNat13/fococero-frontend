// .specs/ARCHITECTURE.md
# ARQUITECTURA - FocoCero Frontend

## 1. Patrón FSD (Feature-Sliced Design)

El frontend se organiza en capas de dependencias unidireccionales para consumir los 8 microservicios del backend:

1. `app/`: Enrutamiento de Expo Router. Controladores de vistas.
2. `widgets/`: Orquestadores que unen UI con lógica de negocio.
3. `features/`: Hooks (`useAlertas`, `useReportes`), Stores de Zustand y APIs.
4. `entities/`: Modelos y DTOs mapeados desde el backend.
5. `shared/`: UI genérica, clientes HTTP (Axios) e interceptores.
6. `core/`: Configuraciones maestras (Firebase Web SDK, MMKV offline).

## 2. Topología del API Gateway (BFF)

**REGLA DE ORO:** El API Gateway NO utiliza versionado explícito. Todas las peticiones de Axios deben dirigirse a `/api/[microservicio]/...`.

| Microservicio | Ruta en Gateway | Estado Auth Requerido |
|---------------|-----------------|-----------------------|
| ms-auth | `/api/auth/*` | Mixto (Público/Privado) |
| ms-geo | `/api/geo/*` | Mixto |
| ms-alertas | `/api/alertas/*` | Firebase Token |
| ms-reportes | `/api/reportes/*` | Firebase Token |
| ms-emergencias | `/api/emergencias/*` | Firebase Token (Brigadista/Admin) |
| ms-analitica | `/api/analitica/*` | Firebase Token (Brigadista/Admin) |
| ms-multimedia | `/api/multimedia/*` | Firebase Token |

## 3. Sistema de Roles (RBAC)

### Permisos por Rol

| Feature | Ciudadano | Brigadista | Admin |
|---------|-----------|------------|-------|
| Auth | ✅ Login/Register | ✅ Login | ✅ Login |
| Alertas | 👁️ Ver | ✅ Cambiar estado | ✅ CRUD completo |
| Reportes | ✅ Crear | ✅ Cambiar estado | ✅ CRUD completo |
| Mapa | 👁️ Ver | ✅ Gestionar focos | ✅ CRUD completo |
| Despachos | ❌ | ✅ Crear/Seguir | ✅ CRUD completo |
| Dashboard | ❌ | 👁️ Ver | ✅ CRUD + Exportar |
| Usuarios | ❌ | ❌ | ✅ CRUD completo |

## 4. Estructura de Navegación

```
app/
├── (auth)/                    # Sin auth requerida
│   ├── login.tsx
│   ├── register.tsx
│   └── guest.tsx
│
├── (ciudadano)/              # Rol: CIUDADANO
│   ├── _layout.tsx           # Tab Bar: Inicio | Reportar | Alertas | Perfil
│   ├── index.tsx
│   ├── crear-reporte.tsx
│   ├── alertas.tsx
│   └── perfil.tsx
│
├── (brigadista)/              # Rol: BRIGADISTA
│   ├── _layout.tsx           # Tab Bar: Dashboard | Mapa | Reportes | Emerg. | Perfil
│   ├── index.tsx
│   ├── mapa.tsx
│   ├── reportes.tsx
│   ├── emergencias.tsx
│   └── perfil.tsx
│
├── (admin)/                  # Rol: ADMIN
│   ├── _layout.tsx           # Tab Bar: Dashboard | Mapa | Usuarios | Config | Perfil
│   ├── index.tsx
│   ├── mapa.tsx
│   ├── usuarios.tsx
│   ├── config.tsx
│   └── perfil.tsx
```

## 5. Componentes UI por Capa

### Atoms (src/shared/ui/atoms/)
- Button, Input, Badge, Avatar, Switch, Spinner, ProgressBar, IconButton, Divider, Checkbox, Typography

### Molecules (src/shared/ui/molecules/)
- ActionCard, StatCard, Modal, BottomSheet, SearchBar, InputGroup, AlertBanner, Toast, EmptyState, SectionHeader

### Organisms (src/shared/ui/)
- Formularios completos, Listas interactivas, Mapas

### Templates (src/widgets/)
- Pantallas completas con lógica de negocio

## 6. Flujo de Datos

```
UI Components → Hooks (React Query) → API Layer → Axios → API Gateway → MS Backend
```

## 7. Resiliencia y Offline-First

Se debe mantener y escalar el patrón implementado en `auth.offline.ts`. Las operaciones críticas de `ms-reportes` y `ms-alertas` deben encolarse en MMKV cuando el dispositivo pierda conexión, sincronizándose en background al recuperar la red.

## 8. Dimensiones Estándar UI

- **Buttons:** Min height 48px, padding 16px horizontal, border-radius 12px
- **Inputs:** Min height 48px, border-radius 12px
- **Cards:** Border-radius 16px, padding 16px
- **Tab Bar:** Height 80px (incluye safe area)
- **Spacing:** Múltiplos de 4px (4, 8, 12, 16, 24, 32, 48)

## 9. Tema Claro/Oscuro

El diseño soporta tema claro y oscuro mediante CSS variables en `global.css`:

- **Modo Claro:** Superficies arena/beige (#FAF5F0), texto oscuro cálido (#1C1917)
- **Modo Oscuro:** Superficies carbón (#1C1917), texto arena clara (#FAF5F0)
- **Brand Primary:** Naranja fuego (#EA580C)