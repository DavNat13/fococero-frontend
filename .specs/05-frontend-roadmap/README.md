# FocoCero Frontend Roadmap

> Documento maestro de planificacion y estado del frontend React Native / Expo para el sistema de gestion de incendios forestales FocoCero.

## Estado Actual

| Fase | Nombre | Estado | APIs Integradas |
|------|--------|--------|-----------------|
| UI-1 | Core Visual | COMPLETADO | 0 |
| UI-2 | Auth + Perfil + Config | COMPLETADO | 4 (usuario, firebase, multimedia, geo) |
| UI-3 | Alertas + Reportes | PENDIENTE | 2 (alertas, reportes) |
| UI-4 | Mapa Interactivo | PENDIENTE | 1 (geo) |
| UI-5 | Despachos | PENDIENTE | 1 (emergencias) |
| UI-6 | Analitica + Exportar | PENDIENTE | 1 (analitica) |
| UI-7 | Multimedia + Extras | PENDIENTE | 1 (multimedia) |

**Completado**: 2 fases | **Pendiente**: 5 fases

## APIs Integradas (7/7 microservicios)

Cada microservicio esta mapeado con React Query hooks, Zustand stores y Facade hooks siguiendo arquitectura FSD (Feature-Sliced Design).

| API | Base URL (mock) | Hooks | Facade |
|-----|-----------------|-------|--------|
| Alertas | /api/alertas | useAlertasQuery | useAlertaFeature |
| Reportes | /api/reportes | useReportesQuery | useReporteFeature |
| Geo | /api/geo | useGeoQuery | useGeoFeature |
| Emergencias | /api/emergencias | useEmergenciasQuery | useEmergenciaFeature |
| Analitica | /api/analitica | useAnaliticaQuery | useAnaliticaFeature |
| Multimedia | /api/multimedia | useMultimediaQuery | useMultimediaFeature |
| Usuario | /api/usuario | useUsuarioQuery | useUsuarioFeature |

## Stack Tecnologico

- **Framework**: React Native 0.76+ / Expo SDK 52+
- **Navegacion**: Expo Router (file-based routing)
- **Estado Global**: Zustand + React Query (TanStack Query v5)
- **Animaciones**: React Native Reanimated 4
- **Mapas**: react-native-maps + heatmap + clustering
- **Seguridad**: SecureStore para JWT, HTTP-only pattern, interceptor Axios
- **Estilo**: Dark tactical theme + atomic design (12 atoms, 12 molecules)
- **Exportacion**: expo-print (PDF), react-native-xlsx (Excel)
- **Notificaciones**: Expo Notifications + Firebase Cloud Messaging

## Arquitectura FSD (Feature-Sliced Design)

```
src/
  app/          -- Expo Router, providers, layouts
  pages/        -- Page components por rol y feature
  widgets/      -- Componentes compuestos reutilizables
  features/     -- Modulos por funcionalidad (alertas, mapa, auth...)
  entities/     -- Modelos de dominio + stores
  shared/       -- UI atoms, hooks comunes, utils, api, lib
```

## Seguridad

- Tokens JWT almacenados exclusivamente en SecureStore (no AsyncStorage)
- Interceptor Axios con refresh token rotation
- Validacion de roles en rutas protegidas (Admin/Brigadista/Ciudadano)
- Guest Access con permisos restringidos
- Sanitizacion de entrada en formularios

## Vulnerabilidades Conocidas y Mitigaciones

| Riesgo | Mitigacion |
|--------|------------|
| Exposicion de JWT en logs | Interceptor que redacta headers Authorization |
| Inyeccion en formularios | Validacion con zod schemas en cada feature |
| Acceso no autorizado a rutas | Role guard en layout de Expo Router |
| Almacenamiento inseguro | SecureStore + expo-crypto para datos locales |
| Cache de React Query expuesto | staleTime controlado + garbage collector configurado |

## DevOps Frontend

- CI/CD con EAS Build + GitHub Actions
- Linting: ESLint + Prettier + Stylelint
- Testing: Jest + React Native Testing Library
- Codegen: orval para tipos desde OpenAPI
- Versionado semantico con changelog automático
