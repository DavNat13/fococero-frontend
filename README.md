# FocoCero - Frontend

Aplicación móvil para el reporte, visualización y gestión de focos de incendio en tiempo real.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Microservicios Backend](#microservicios-backend)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Scripts Disponibles](#scripts-disponibles)
- [Estado del Roadmap](#estado-del-roadmap)
- [Contribución](#contribución)

---

## Descripción

FocoCero es una aplicación **offline-first** desarrollada en React Native/Expo que permite:

- **Ciudadanos**: Reportar incendios, ver alertas cercanas y subir evidencia multimedia.
- **Brigadistas**: Gestionar estados de alertas, coordinar despachos y visualizar el dashboard analítico.
- **Administradores**: Control total del sistema y acceso a analítica predictiva.

---

## Tecnologías

| Categoría           | Tecnología                                                       |
| ------------------- | ---------------------------------------------------------------- |
| **Framework**       | React Native 0.81.5 / Expo SDK 54                                |
| **Lenguaje**        | TypeScript 5.9 (strict mode)                                     |
| **Estado Global**   | Zustand 5 con persist middleware                                 |
| **Estado Servidor** | TanStack React Query 5                                           |
| **Navegación**      | Expo Router 6 (file-based routing)                               |
| **HTTP Client**     | Axios con interceptores (Result pattern)                         |
| **UI**              | NativeWind 4 (Tailwind CSS) + tailwind-merge + tailwind-variants |
| **Mapas**           | react-native-maps + expo-location                                |
| **Offline**         | AsyncStorage + SecureStore + Outbox Pattern                      |
| **Auth**            | Firebase Web SDK + expo-auth-session                             |
| **Validación**      | Zod 4                                                            |
| **Formularios**     | react-hook-form + @hookform/resolvers                            |
| **Animaciones**     | react-native-reanimated 4                                        |
| **Testing**         | Jest + @testing-library/react-native                             |

---

## Arquitectura

### Patrón FSD (Feature-Sliced Design)

```
src/
├── app/                 # Expo Router - Rutas y layouts por rol
│   ├── (auth)/          # Login, Register, Guest
│   ├── (ciudadano)/     # Inicio, Reportar, Alertas, Perfil
│   ├── (brigadista)/    # Dashboard, Mapa, Reportes, Emerg., Perfil
│   └── (admin)/         # Dashboard, Mapa, Usuarios, Config, Perfil
├── widgets/            # Componentes orquestadores UI
├── features/           # Hooks, Stores, APIs específicas de dominio
├── entities/           # Modelos, DTOs, tipos mapeados del backend
├── shared/             # UI atómica, molecular, layouts, animaciones, formularios
└── core/               # Configuraciones maestras (Firebase, API, offline)
```

### API Gateway (BFF)

El frontend se comunica exclusivamente con el **API Gateway** en el puerto 3000. Las rutas siguen el patrón:

```
/api/[microservicio]/*
```

**Regla importante**: No usar `/api/v1/*` - el Gateway no utiliza versionado explícito.

---

## Estructura del Proyecto

```
fococero-frontend/
├── .specs/                    # Especificaciones del proyecto
│   ├── roadmap.md             # Hoja de ruta y estado
│   ├── PRODUCT_REQUIREMENTS.md
│   ├── TECH_STACK.md
│   ├── ARCHITECTURE.md
│   └── CONVENTIONS.md
├── app/                       # Expo Router - Rutas de navegación
│   ├── (auth)/                # Login, Register, Guest
│   ├── (ciudadano)/           # Inicio, Reportar, Alertas, Perfil
│   ├── (brigadista)/          # Dashboard, Mapa, Reportes, Emerg., Perfil
│   └── (admin)/               # Dashboard, Mapa, Usuarios, Config, Perfil
├── src/
│   ├── core/                  # Configuración central
│   │   ├── api/               # Axios client + interceptors (Result pattern)
│   │   ├── config/            # Env (Zod) + Firebase config
│   │   ├── navigation/        # Utilidades de navegación
│   │   └── offline/           # Storage, outbox queue, sync orchestrator
│   ├── entities/              # Modelos y APIs por dominio
│   │   ├── alerta/            # Gestión de alertas
│   │   ├── reporte/           # Reportes ciudadanos
│   │   ├── geo/               # Geo-espacial (focos)
│   │   ├── emergencia/        # Despacho de emergencias
│   │   ├── analitica/         # Dashboard y métricas
│   │   ├── multimedia/        # Evidencia multimedia
│   │   ├── usuario/           # Perfil de usuario
│   │   └── foco-incendio/     # Focos de incendio (legacy)
│   ├── features/              # Lógica de negocio
│   │   ├── auth/              # Auth (store, hooks, API, offline-strategy)
│   │   ├── foco-incendio/     # Legacy fire feature
│   │   ├── reportes/          # Placeholder
│   │   └── emergencias/       # Placeholder
│   ├── shared/                # UI compartida
│   │   └── ui/                # Atoms, molecules, layouts, animations, forms, icons, illustrations
│   └── widgets/               # Componentes orquestadores
├── .env                       # Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

---

## Microservicios Backend

| Microservicio      | Puerto | Ruta Gateway         | Descripción              |
| ------------------ | ------ | -------------------- | ------------------------ |
| **ms-auth**        | 3001   | `/api/auth/*`        | Autenticación y usuarios |
| **ms-geo**         | 3002   | `/api/geo/*`         | Focos georreferenciados  |
| **ms-alertas**     | 3003   | `/api/alertas/*`     | Gestión de alertas       |
| **ms-reportes**    | 3004   | `/api/reportes/*`    | Reportes ciudadanos      |
| **ms-multimedia**  | 3005   | `/api/multimedia/*`  | Evidencia multimedia     |
| **ms-emergencias** | 3006   | `/api/emergencias/*` | Despacho a organismos    |
| **ms-analitica**   | 3007   | `/api/analitica/*`   | Dashboard y métricas     |
| **api-gateway**    | 3000   | -                    | BFF y proxy              |

### Autenticación

Los endpoints privados requieren **Firebase Token** en el header:

```
Authorization: Bearer <firebase_token>
```

El interceptor en `api.interceptors.ts` inyecta automáticamente el token desde el store de auth.

---

## Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Docker (para el backend)

### 1. Clonar el proyecto

```bash
git clone <repositorio>
cd fococero-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz:

```env
# ==========================================
# CONEXIÓN AL BACKEND (BFF)
EXPO_PUBLIC_API_GATEWAY_URL=http://192.168.1.142:3000
EXPO_PUBLIC_ENVIRONMENT=development
# ==========================================
# FIREBASE WEB SDK (Para Google Auth en Expo Go)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBP0PQCqTtKVY-wWJySB5n72rSHkGSkMLU
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=fococero-218bf.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=fococero-218bf
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=fococero-218bf.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=303096009068
EXPO_PUBLIC_FIREBASE_APP_ID=1:303096009068:web:6d0cb5efb535c75a6ca349
```

> **Nota**: La IP `192.168.1.142` es la del equipo donde corre el backend. Ajustar según tu red local.

### 4. Backend (necesario para desarrollo)

Verificar que el API Gateway esté corriendo:

```bash
# Desde el directorio fococero-backend
docker-compose up -d
```

Verificar conectividad:

```bash
curl http://192.168.1.142:3000/health
```

---

## Ejecución

### Modo Desarrollo (Expo Go)

```bash
npm start
# o
expo start
```

Escanear el QR con la app Expo Go en el dispositivo móvil.

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

### Web

```bash
npm run web
```

---

## Scripts Disponibles

| Script               | Descripción                     |
| -------------------- | ------------------------------- |
| `npm start`          | Iniciar Expo en modo desarrollo |
| `npm run type-check` | Verificar tipos TypeScript      |
| `npm run lint`       | Verificar estilo de código      |
| `npm run format`     | Formatear código con Prettier   |
| `npm run test`       | Ejecutar tests                  |
| `npm run android`    | Compilar Android                |
| `npm run ios`        | Compilar iOS                    |

---

## Componentes UI Compartidos

### Atoms

`Avatar`, `Badge`, `Button`, `Card`, `Checkbox`, `Divider`, `IconButton`, `Input`, `ProgressBar`, `Spinner`, `Switch`, `Typography`

### Molecules

`ActionCard`, `AlertBanner`, `BottomSheet`, `EmptyState`, `InfoListItem`, `InputGroup`, `ModalDialog`, `SearchBar`, `SectionHeader`, `StatCard`, `StepIndicator`, `Toast`

### Layouts

`SafeAreaLayout`, `FocusAwareStatusBar`, `KeyboardScrollLayout`, `ScreenHeader`

### Animations

`FadeIn`, `ScalePress`, `SlideUpCard`, `ShakeError`, `PulseAlert`, `SkeletonShimmer`, `KeyboardShift`

### Formularios Controlados

`ControlledInput`, `ControlledCheckbox`, `ControlledSwitch`, `ControlledRadioGroup`, `ControlledSegmentedControl`, `ControlledSlider`, `ControlledImagePicker`

### Illustrations SVG

`EmptyRadar`, `OfflineSatellite`, `CloudSyncSuccess`

---

## Estado del Roadmap

### ✅ APIs Integradas (Parte 1)

- [x] Alertas API + React Query + Zustand + Facade hook
- [x] Reportes API + React Query + Zustand + Facade hook
- [x] Geo API + React Query + Zustand + Facade hook
- [x] Emergencias API + React Query + Zustand + Facade hook
- [x] Analítica API + React Query + Zustand + Facade hook
- [x] Multimedia API + React Query + Zustand + Facade hook
- [x] Usuario API + Auth API (actualizados para Gateway)

### ✅ Fase UI-1: Core Visual + Navegación por Rol 🎨

- [x] Tema oscuro táctico con paleta de fuego
- [x] Sistema de componentes atómicos (12 componentes)
- [x] Sistema de componentes moleculares (12 componentes)
- [x] Layouts reutilizables (SafeArea, KeyboardScroll, ScreenHeader)
- [x] Animaciones Reanimated 4 (FadeIn, ScalePress, SlideUp, Shake, Pulse, Skeleton)
- [x] Ilustraciones SVG (EmptyRadar, OfflineSatellite, CloudSyncSuccess)
- [x] Navegación Tab Bar por rol (Admin, Brigadista, Ciudadano)

### ✅ Fase UI-2: Auth + Perfil + Config 👤

- [x] WelcomeWidget con animaciones y Google Auth
- [x] AuthFormWidget (Login/Register con toggle)
- [x] Pantallas de perfil por rol (Admin, Brigadista, Ciudadano)
- [x] Pantalla de Configuración (Admin)
- [x] Guest Access Widget

### ⏳ Fase UI-3: Alertas + Reportes

- [ ] Lista de alertas con filtros
- [ ] Formulario crear alerta con mapa
- [ ] Detalle de alerta con timeline
- [ ] Formulario crear reporte con categorías
- [ ] Lista de reportes con filtros

### ⏳ Fase UI-4: Mapa Interactivo

- [ ] Integración react-native-maps
- [ ] Modos: estándar, satelital, 3D
- [ ] Heatmap y marcadores personalizados
- [ ] Tracking de ubicación

### ⏳ Fase UI-5: Despachos

- [ ] Formulario crear despacho
- [ ] Tracking en tiempo real
- [ ] Notificaciones de cambio de estado

### ⏳ Fase UI-6: Analítica + Exportar

- [ ] Dashboard con KPIs visuales
- [ ] Gráficos (líneas, barras)
- [ ] Exportar PDF / Excel

### ⏳ Fase UI-7: Multimedia + Extras

- [ ] Upload de fotos/videos
- [ ] Galería de evidencias
- [ ] Alertas push por región

---

## Integraciones Creadas

### Entities

| Entity         | API | Queries | Store         | Hooks                     |
| -------------- | --- | ------- | ------------- | ------------------------- |
| **alerta**     | ✅  | ✅      | ✅            | ✅ `useAlertaFeature`     |
| **reporte**    | ✅  | ✅      | ✅            | ✅ `useReporteFeature`    |
| **geo**        | ✅  | ✅      | ✅            | ✅ `useGeoFeature`        |
| **emergencia** | ✅  | ✅      | ✅            | ✅ `useEmergenciaFeature` |
| **analitica**  | ✅  | ✅      | ✅            | ✅ `useAnaliticaFeature`  |
| **multimedia** | ✅  | ✅      | ✅            | ✅ `useMultimediaFeature` |
| **usuario**    | ✅  | -       | -             | -                         |
| **auth**       | ✅  | -       | ✅ auth.store | -                         |

### Offline-First

| Componente               | Descripción                                                                       |
| ------------------------ | --------------------------------------------------------------------------------- |
| `storage.client.ts`      | 3 particiones: global (AsyncStorage), secure (SecureStore), outbox (AsyncStorage) |
| `storage.adapter.ts`     | Adaptador Zustand con caché L1 (RAM) + L2 (disco)                                 |
| `offline.queue.ts`       | Gestor de cola Outbox (enqueue, dequeue, retry)                                   |
| `offline.sync.ts`        | Orquestador de sincronización con NetInfo + reintentos (max 3)                    |
| `auth/offline-strategy/` | Creación optimista de usuario + cola de registro + resolución de conflictos       |

### Endpoints Integrados

#### Alertas (`/api/alertas`)

`POST /` | `GET /mis-alertas` | `GET /cercanas` | `GET /:id` | `GET /` | `POST /:id/verificar` | `PATCH /:id/estado` | `DELETE /:id`

#### Reportes (`/api/reportes`)

`GET /categorias` | `POST /` | `GET /` | `GET /me` | `GET /:id` | `PATCH /:id` | `DELETE /:id` | `GET /:id/historial` | `PATCH /:id/estado`

#### Geo (`/api/geo`)

`POST /` | `GET /` | `GET /cercanos` | `GET /:id` | `PATCH /:id/estado` | `PATCH /:id/perimetro` | `PUT /:id` | `DELETE /:id`

#### Emergencias (`/api/emergencias`)

`POST /` | `GET /` | `GET /:id` | `PATCH /:id/estado`

#### Analítica (`/api/analitica`)

`GET /dashboard` | `GET /predictivo`

#### Multimedia (`/api/multimedia`)

`POST /upload` | `DELETE /:id`

---

## Contribución

### Conventional Commits

Usar formato de commits conventional:

```
feat(auth): agregar login con Google
fix(alertas): corregir validación de estado
refactor(reporte): simplificar estructura de store
docs(readme): actualizar instrucciones de instalación
```

### Reglas de Código

- **TypeScript strict**: No usar `any`
- **Imports**: Usar path aliases (`@entities/...`, `@features/...`)
- **Tests**: Cobertura mínima 80% para lógica de dominio
- **Idiomas**: Código en inglés, documentación en español

### Ramas

- `main` - Producción
- `develop` - Integración
- `feature/[nombre]` - Desarrollo

---

## Notas de Desarrollo

### IP del Gateway

La IP `192.168.x.xxx` está hardcodeada en `.env`. Para desarrollo en red local, asegurar que:

1. El dispositivo móvil esté en la misma red WiFi
2. El puerto 3000 esté abierto en el firewall
3. La IP sea correcta (verificar con `ipconfig` en Windows)

### Offline-First

El proyecto implementa una arquitectura offline robusta:

- **Outbox Pattern**: Mutaciones offline encoladas en AsyncStorage, sincronizadas al recuperar conexión
- **Particionamiento de almacenamiento**: global, seguro (SecureStore + fallback AsyncStorage), outbox
- **Caché L1/L2**: RAM + disco para máxima resiliencia
- **Sync Orchestrator**: Escucha cambios de red con `NetInfo`, procesa cola con reintentos (max 3)
- **Claves de idempotencia**: Previene procesamiento duplicado en sincronización

---

## Licencia

MIT © 2026 FocoCero
