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

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | React Native 0.74+ / Expo SDK 51+ |
| **Lenguaje** | TypeScript (strict mode) |
| **Estado Global** | Zustand |
| **Estado Servidor** | TanStack Query (React Query) |
| **Navegación** | Expo Router |
| **HTTP Client** | Axios con interceptores |
| **UI** | NativeWind (Tailwind CSS) + UI propia |
| **Mapas** | react-native-maps + expo-location |
| **Offline** | AsyncStorage / MMKV |
| **Auth** | Firebase Web SDK |
| **Validación** | Zod |

---

## Arquitectura

### Patrón FSD (Feature-Sliced Design)

```
src/
├── app/                 # Expo Router - Controladores de vistas
├── widgets/            # Componentes orquestadores UI
├── features/           # Hooks, Stores, APIs específicas de dominio
├── entities/           # Modelos, DTOs, tipos mapeados del backend
├── shared/             # UI genérica, utilitarias
└── core/               # Configuraciones maestras (Firebase, API, etc.)
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
│   ├── (auth)/                # Login, Register
│   ├── (brigadista)/          # Panel brigadista
│   └── (admin)/               # Panel administrador
├── src/
│   ├── core/                  # Configuración central
│   │   ├── api/               # Axios client + interceptors
│   │   │   ├── api.client.ts
│   │   │   ├── api.interceptors.ts
│   │   │   ├── api.errors.ts
│   │   │   └── api.types.ts
│   │   └── config/
│   │       └── env.config.ts
│   ├── entities/              # Modelos y APIs por dominio
│   │   ├── alerta/            # Gestión de alertas
│   │   ├── reporte/           # Reportes ciudadanos
│   │   ├── geo/               # Geo-espacial (focos)
│   │   ├── usuario/           # Perfil de usuario
│   │   ├── foco-incendio/     # Focos de incendio (legacy)
│   │   ├── brigadista/
│   │   └── reporte/
│   ├── features/              # Lógica de negocio
│   │   ├── auth/              # Auth (store, hooks, API)
│   │   └── foco-incendio/
│   ├── shared/                # UI compartida
│   │   └── ui/                # Componentes UI
│   └── widgets/               # Componentes orquestadores
├── .env                       # Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

---

## Microservicios Backend

| Microservicio | Puerto | Ruta Gateway | Descripción |
|---------------|--------|--------------|-------------|
| **ms-auth** | 3001 | `/api/auth/*` | Autenticación y usuarios |
| **ms-geo** | 3002 | `/api/geo/*` | Focos georreferenciados |
| **ms-alertas** | 3003 | `/api/alertas/*` | Gestión de alertas |
| **ms-reportes** | 3004 | `/api/reportes/*` | Reportes ciudadanos |
| **ms-multimedia** | 3005 | `/api/multimedia/*` | Evidencia multimedia |
| **ms-emergencias** | 3006 | `/api/emergencias/*` | Despacho a organismos |
| **ms-analitica** | 3007 | `/api/analitica/*` | Dashboard y métricas |
| **api-gateway** | 3000 | - | BFF y proxy |

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

| Script | Descripción |
|--------|-------------|
| `npm start` | Iniciar Expo en modo desarrollo |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run lint` | Verificar estilo de código |
| `npm run format` | Formatear código con Prettier |
| `npm run test` | Ejecutar tests |
| `npm run android` | Compilar Android |
| `npm run ios` | Compilar iOS |

---

## Estado del Roadmap

### ✅ Fase 1: Fundamentos Críticos
- [x] Corrección de rutas auth (eliminado `/v1/`)
- [x] Interceptor de Firebase Token
- [x] Validación E2E con Gateway

### ✅ Fase 2: Core Operativo (Alertas)
- [x] `alertas.api.ts` con todos los endpoints
- [x] React Query hooks
- [x] Zustand store
- [x] Hook facade `useAlertaFeature`

### ✅ Fase 3: Reportes Ciudadanos
- [x] `reportes.api.ts` con todos los endpoints
- [x] React Query hooks
- [x] Zustand store
- [x] Hook facade `useReporteFeature`

### ✅ Fase 4: Geo-Espacial
- [x] `geo.api.ts` con todos los endpoints
- [x] React Query hooks
- [x] Zustand store (incluye centroMapa, zoomMapa)
- [x] Hook facade `useGeoFeature`
- [ ] Integración con `react-native-maps`
- [ ] Renderizado de focos en mapa

### ⏳ Fase 5: Despacho de Emergencias
- [ ] `emergencias.api.ts`
- [ ] UI de tracking y coordinación

### ⏳ Fase 6: Analítica y Dashboard
- [ ] `analitica.api.ts`
- [ ] UI de métricas y heatmaps

### ⏳ Fase 7: Multimedia
- [ ] Gestión de evidencias fotográficas

---

## Integraciones Creadas

### Entities Creadas/Actualizadas

| Entity | API | Queries | Store | Hooks |
|--------|-----|---------|-------|-------|
| **alerta** | ✅ `alerta.api.ts` | ✅ `queries.ts` | ✅ `store.ts` | ✅ `useAlertaFeature.ts` |
| **reporte** | ✅ `reporte.api.ts` | ✅ `queries.ts` | ✅ `store.ts` | ✅ `useReporteFeature.ts` |
| **geo** | ✅ `geo.api.ts` | ✅ `queries.ts` | ✅ `store.ts` | ✅ `useGeoFeature.ts` |
| **usuario** | ✅ `usuario.api.ts` (actualizado) | - | - | - |
| **auth** | ✅ `auth.api.ts` (actualizado) | - | - | - |

### Endpoints Integrados

#### Alertas (`/api/alertas`)
- `POST /` - Crear alerta
- `GET /mis-alertas` - Mis alertas
- `GET /cercanas` - Alertas cercanas
- `GET /:id` - Por ID
- `GET /` - Todas (ADMIN/BRIGADISTA)
- `POST /:id/verificar` - Verificar
- `PATCH /:id/estado` - Cambiar estado
- `DELETE /:id` - Eliminar (ADMIN)

#### Reportes (`/api/reportes`)
- `GET /categorias` - Listar categorías
- `POST /` - Crear reporte
- `GET /` - Listar todos
- `GET /me` - Mis reportes
- `GET /:id` - Por ID
- `PATCH /:id` - Actualizar
- `DELETE /:id` - Eliminar
- `GET /:id/historial` - Historial (ADMIN/BRIGADISTA)
- `PATCH /:id/estado` - Cambiar estado (ADMIN/BRIGADISTA)

#### Geo (`/api/geo`)
- `POST /` - Reportar foco
- `GET /` - Obtener todos
- `GET /cercanos` - Focos cercanos
- `GET /:id` - Por ID
- `PATCH /:id/estado` - Cambiar estado
- `PATCH /:id/perimetro` - Actualizar perímetro
- `PUT /:id` - Actualizar completo
- `DELETE /:id` - Eliminar

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

El proyecto implementa estrategia offline en `features/auth/offline-strategy/`. Para扩展 a otras entidades (alertas, reportes), seguir el mismo patrón usando AsyncStorage.

---

## Licencia

MIT © 2024 FocoCero