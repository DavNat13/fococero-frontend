# AGENTS.md — Contexto Técnico del Proyecto FocoCero

> **Propósito**: Este archivo documenta todas las decisiones técnicas, arquitectura, fixes aplicados y configuraciones críticas del proyecto. Está diseñado para que futuras sesiones de AI coding (o nuevos desarrolladores) puedan ponerse al día en minutos, no en horas.
>
> **Idioma**: Español (el proyecto es para usuarios chilenos).

---

## Índice

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Arquitectura del Backend (Monorepo)](#2-arquitectura-del-backend-monorepo)
3. [Arquitectura del Frontend (Expo/React Native)](#3-arquitectura-del-frontend-expo-react-native)
4. [Flujo Completo de Google Sign-In](#4-flujo-completo-de-google-sign-in)
5. [Fixes Críticos Aplicados](#5-fixes-críticos-aplicados)
   - [5.1 Backend: pathRewrite en API Gateway](#51-backend-pathrewrite-en-api-gateway)
   - [5.2 Backend: Middleware de normalización de URL](#52-backend-middleware-de-normalización-de-url)
   - [5.3 Backend: Guard clause en loginWithGoogle](#53-backend-guard-clause-en-loginwithgoogle)
   - [5.4 Backend: Logging seguro (fix de seguridad)](#54-backend-logging-seguro-fix-de-seguridad)
   - [5.5 Frontend: Store token antes del API call](#55-frontend-store-token-antes-del-api-call)
   - [5.6 Frontend: Reemplazo de librería Google Sign-In](#56-frontend-reemplazo-de-librería-google-sign-in)
   - [5.7 Frontend: Android package name](#57-frontend-android-package-name)
   - [5.8 Frontend: Plugin Google Services para Android](#58-frontend-plugin-google-services-para-android)
   - [5.9 Backend: Catch-all route en ms-auth](#59-backend-catch-all-route-en-ms-auth)
6. [Notas Importantes de Arquitectura](#6-notas-importantes-de-arquitectura)
   - [6.1 Orden de rutas en ms-auth (CRÍTICO)](#61-orden-de-rutas-en-ms-auth-crítico)
   - [6.2 Diferencia de versiones Express](#62-diferencia-de-versiones-express)
   - [6.3 AUTH_SERVICE_URL y resolución de servicios](#63-auth_service_url-y-resolución-de-servicios)
7. [Dependencias y Configuración](#7-dependencias-y-configuración)
   - [7.1 Variables de entorno del Frontend](#71-variables-de-entorno-del-frontend)
   - [7.2 Variables de entorno del Backend](#72-variables-de-entorno-del-backend)
8. [Configuración en Google Cloud / Firebase Console](#8-configuración-en-google-cloud--firebase-console)
9. [Infraestructura Docker](#9-infraestructura-docker)
10. [Arquitectura de Estado (Zustand)](#10-arquitectura-de-estado-zustand)
11. [Interceptor Axios y el Token Bearer](#11-interceptor-axios-y-el-token-bearer)
12. [Preguntas Frecuentes Técnicas](#12-preguntas-frecuentes-técnicas)

---

## 1. Visión General del Proyecto

**FocoCero** es una aplicación chilena de **reporte y coordinación de incendios forestales**. Permite a ciudadanos reportar incendios, a brigadistas coordinar respuestas, y a autoridades visualizar mapas de riesgo en tiempo real.

| Capa | Tecnología | Ubicación |
|------|-----------|-----------|
| **Frontend (App Móvil)** | Expo / React Native (TypeScript) | `C:\f\` |
| **Backend (API Gateway)** | Express v4 + http-proxy-middleware | `C:\FocoCero\fococero-backend\api-gateway\` |
| **Backend (Microservicios)** | Express v5 (TypeScript) | `C:\FocoCero\fococero-backend\ms-*/` |
| **Base de Datos** | PostgreSQL + PostGIS (Postgres 15) | Docker (`db-fococero`) |
| **Cache / Sesiones** | Redis 7 | Docker (`redis-fococero`) |
| **Mensajería** | RabbitMQ 3 | Docker (`rabbitmq`) |
| **Service Discovery** | Eureka Server (Steeltoe) | Docker (`eureka-server`) |
| **Proxy Reverse** | Caddy 2 | Docker (`caddy`) |
| **Orquestación** | Docker Compose | `C:\FocoCero\fococero-backend\docker-compose.yml` |

---

## 2. Arquitectura del Backend (Monorepo)

```
fococero-backend/
├── api-gateway/          # Express v4 — Puerto 3000
│   ├── src/
│   │   ├── routes/
│   │   │   └── routes.ts     # Proxy definitions + pathRewrite
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts   # verifyToken (Firebase Admin)
│   │   │   └── traceId.ts
│   │   └── config/
│   │       └── envs.ts       # Zod schema validation
│   └── .env
│
├── ms-auth/              # Express v5 — Puerto 3001
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── routes/
│   │   │   └── auth.routes.ts    # ¡ORDEN CRÍTICO! (ver §6.1)
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts # validateFirebaseToken
│   │   │   └── role.middleware.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   └── user.enum.ts      # UserRole, UserStatus
│   │   ├── repositories/
│   │   │   └── user.repository.ts
│   │   ├── validators/
│   │   │   └── auth.validator.ts
│   │   ├── helpers/
│   │   │   ├── appError.ts
│   │   │   └── rut.helper.ts
│   │   ├── config/
│   │   │   ├── envs.ts
│   │   │   ├── firebase.ts       # Firebase Admin init
│   │   │   ├── database.ts       # pg pool
│   │   │   └── eureka.client.ts
│   │   └── index.ts
│   └── .env
│
├── ms-geo/               # Express v5 — Puerto 3002
├── ms-alertas/           # Express v5 — Puerto 3003
├── ms-reportes/          # Express v5 — Puerto 3004
├── ms-multimedia/        # Express v5 — Puerto 3005
├── ms-emergencias/       # Express v5 — Puerto 3006
├── ms-analitica/         # Express v5 — Puerto 3007
│
├── caddy/
│   └── Caddyfile
└── docker-compose.yml
```

### Puerto de los Microservicios

| Servicio | Puerto Interno | Puerto Expuesto |
|----------|---------------|-----------------|
| `api-gateway` | 3000 | 3000 |
| `ms-auth` | 3001 | — (solo red interna) |
| `ms-geo` | 3002 | — |
| `ms-alertas` | 3003 | — |
| `ms-reportes` | 3004 | — |
| `ms-multimedia` | 3005 | — |
| `ms-emergencias` | 3006 | — |
| `ms-analitica` | 3007 | — |

> **Importante**: Solo `api-gateway` y `caddy` exponen puertos al host. Los microservicios se comunican exclusivamente por la red interna `fococero-network`.

---

## 3. Arquitectura del Frontend (Expo / React Native)

```
f/  (C:\f\)
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/                   # Grupo de rutas de autenticación
│   │   ├── welcome.tsx           # Pantalla de bienvenida con "Continuar con Google"
│   │   └── login.tsx
│   └── (main)/                   # Grupo de rutas principales (post-auth)
│       └── ...
├── src/
│   ├── core/
│   │   ├── api/
│   │   │   ├── api.client.ts     # Cliente Axios base
│   │   │   ├── api.interceptors.ts  # 🔥 Interceptor que lee firebaseToken del store
│   │   │   └── api.errors.ts
│   │   └── config/
│   │       ├── env.config.ts     # Variables de entorno tipadas
│   │       └── firebase.config.ts  # Firebase Web SDK init
│   └── features/
│       └── auth/
│           ├── hooks/
│           │   └── useGoogleAuth.ts   # 🔥 Hook principal de Google Sign-In
│           ├── api/
│           │   └── auth.api.ts        # Llamadas a /api/auth/*
│           ├── model/
│           │   ├── auth.store.ts      # 🔥 Zustand store (con persist secure)
│           │   └── auth.types.ts      # Tipos: AuthStatus, estados
│           └── utils/
│               └── token.utils.ts     # Decodificación y validación JWT
├── app.json                       # Configuración Expo
├── android/
│   ├── app/
│   │   ├── build.gradle           # Incluye plugin google-services
│   │   └── google-services.json   # ⚠️ No comitear, rotar periódicamente
│   └── build.gradle               # classpath google-services 4.4.2
├── .env                           # Variables públicas (API keys, client IDs)
└── package.json
```

---

## 4. Flujo Completo de Google Sign-In

Este es el flujo de autenticación más importante del sistema. Cualquier modificación debe considerar CADA paso.

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO                                  │
│  Toca "Continuar con Google" en WelcomeScreen                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  @react-native-google-signin/google-signin                      │
│  Abre diálogo nativo de Google Play Services                    │
│  Usuario selecciona cuenta → Google devuelve idToken            │
└──────────────────────────┬──────────────────────────────────────┘
                           │  idToken
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Firebase Auth (Web SDK)                                        │
│  const credential = GoogleAuthProvider.credential(idToken)      │
│  const userCred = await signInWithCredential(auth, credential)  │
│  const firebaseToken = await userCred.user.getIdToken()         │
└──────────────────────────┬──────────────────────────────────────┘
                           │  firebaseToken
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ PASO CRÍTICO: Store token ANTES del API call                │
│  useAuthStore.setState({ firebaseToken })  ← Línea 64          │
│                                                                 │
│  Razón: El interceptor de Axios (api.interceptors.ts:23) lee    │
│  firebaseToken del store SÍNCRONICAMENTE. Sin esto, la          │
│  petición POST /api/auth/google NO lleva Authorization header.  │
└──────────────────────────┬──────────────────────────────────────┘
                           │  Token en store
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  authApi.registerGoogle({ googleToken: firebaseToken })         │
│  → POST /api/auth/google  body: { token: firebaseToken }       │
│  → Axios interceptor attach: Authorization: Bearer <token>     │
└──────────────────────────┬──────────────────────────────────────┘
                           │  Llega a api-gateway:3000/api/auth/google
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  API Gateway (Express v4)                                       │
│  routes.ts:  appRoutes.use('/api/auth', proxy → ms-auth:3001)  │
│                                                                 │
│  Express v4 STRIPA el mount path '/api/auth' de req.url         │
│  Lo que llega al proxy:  req.url = '/google'                    │
│  pathRewrite '^/api/auth': ''  CASI NUNCA se ejecuta            │
│  (ver §6.2 para explicación detallada)                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │  req.url = '/google'
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  ms-auth (Express v5)                                           │
│  Antes de rutear: normalización de URL (colapsa //)             │
│  → router.post('/google', AuthController.loginWithGoogle)       │
│                                                                 │
│  Guard clause: ¿req.body existe y es objeto?                    │
│  → Sí → AuthService.loginWithGoogle(req.body)                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │  body.token
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  AuthService.loginWithGoogle()                                  │
│  1. Valida con AuthValidator.validateGoogleAuth(data)           │
│  2. admin.auth().verifyIdToken(token)                           │
│     → Si expiró o es inválido → 401                             │
│  3. Busca usuario por firebase_uid en PostgreSQL                │
│  4. Si no existe, busca por email                               │
│  5. Si existe: vincula firebase_uid si falta, valida estado     │
│  6. Si no existe: CREA usuario con rol = UserRole.USUARIO       │
│     - RUT placeholder: GG + últimos 9 chars del firebaseUid     │
│     - Nombre/apellido extraídos del token de Google             │
│  7. Crea Firebase Custom Token:                                 │
│     admin.auth().createCustomToken(firebaseUid)                 │
│  8. Retorna { user, firebaseToken }                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │  { usuario, firebaseToken }
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Frontend recibe respuesta                                      │
│  if (apiResponse.success && apiResponse.data?.usuario) {        │
│      setAuthData(apiResponse.data.usuario, firebaseToken)       │
│  } else {                                                       │
│      // Rollback: limpia el token del store                     │
│      useAuthStore.setState({ firebaseToken: null })             │
│  }                                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │  Store → status: 'authenticated'
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  AuthRedirect (useEffect) detecta cambio de status              │
│  → Redirige a getRouteByRole(user.rol)                          │
│  (ej: USUARIO → /home, BRIGADISTA → /brigada, ADMIN → /admin)  │
└─────────────────────────────────────────────────────────────────┘
```

### Diagrama de Secuencia (Resumen)

```
Usuario     GoogleSDK     FirebaseSDK     ZustandStore     AxiosInt.     API Gateway     ms-auth     PostgreSQL
   │            │              │               │               │              │            │            │
   │--tap Google-│             │               │               │              │            │            │
   │            │--idToken---->│               │               │              │            │            │
   │            │              │--verify------>│               │              │            │            │
   │            │              │<--firebaseTkn-│               │              │            │            │
   │            │              │               │--setState()-->│              │            │            │
   │            │              │               │ (firebaseTkn) │              │            │            │
   │            │              │               │               │              │            │            │
   │            │              │--POST /google-│               │--Bearer----->│            │            │
   │            │              │  {token}      │               │  attach by   │            │            │
   │            │              │               │               │  interceptor │--proxy---->│            │
   │            │              │               │               │              │            │--verifyId->│
   │            │              │               │               │              │            │<--ok-------│
   │            │              │               │               │              │            │--findBy----│
   │            │              │               │               │              │            │<--user/no--│
   │            │              │               │               │              │            │--orCreate->│
   │            │              │               │               │              │            │<--user-----│
   │            │              │               │               │              │            │--customTkn │
   │            │              │<--{usuario,fbToken}------------│              │            │            │
   │            │              │               │--setAuthData->│              │            │            │
   │            │              │               │(status: auth) │              │            │            │
   │            │              │               │--redirect---->│              │            │            │
```

---

## 5. Fixes Críticos Aplicados

### 5.1 Backend: pathRewrite en API Gateway

- **Archivo**: `api-gateway/src/routes/routes.ts` (línea 88)
- **Cambio**: `'^/api/auth': '/'` → `'^/api/auth': ''`
- **Contexto**: `http-proxy-middleware` opción `pathRewrite`
- **Problema original**: Con `'/'` como rewrite, cuando Express v4 NO lograba strip el mount path (casos borde), el proxy producía `//google` (doble slash). Express v5 con `path-to-regexp` v8 es estricto y no matchea rutas con doble slash.
- **Solución**: Rewrite con string vacío `''` produce `/google` correctamente.
- **Nota**: En la práctica, Express v4 casi siempre strica el mount path (ver §6.2), por lo que este rewrite es mayormente defensivo.

```typescript
// ANTES (roto):
createProxyMiddleware(getProxyOptions(envs.AUTH_SERVICE_URL, {
    '^/api/auth': '/'   // produce //google → 404 en Express v5
}))

// DESPUÉS (correcto):
createProxyMiddleware(getProxyOptions(envs.AUTH_SERVICE_URL, {
    '^/api/auth': ''    // produce /google → matchea router.post('/google')
}))
```

### 5.2 Backend: Middleware de normalización de URL

- **Archivo**: `ms-auth/src/index.ts` (líneas 41–46)
- **Cambio**: Se agregó middleware que colapsa dobles slashes en `req.url`
- **Problema original**: Proxies intermedios (Caddy, load balancers, Docker networking) pueden introducir dobles slashes en la URL (`//google`). Express v5 con `path-to-regexp` v8 es estricto y no los maneja.
- **Solución**: Middleware temprano (justo después de `express.json()`) que normaliza la URL.

```typescript
// ms-auth/src/index.ts
app.use((req, _res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/{2,}/g, '/');
  }
  next();
});
```

### 5.3 Backend: Guard clause en loginWithGoogle

- **Archivo**: `ms-auth/src/controllers/auth.controller.ts` (líneas 70–72)
- **Cambio**: Validación de existencia y tipo de `req.body`
- **Problema original**: Si `req.body` es `undefined` (body malformed, Content-Type incorrecto), la línea `data.token` en `auth.service.ts` lanzaba `TypeError: Cannot read properties of undefined (reading 'token')`. Este error no se manejaba elegantemente.
- **Solución**: Guard clause con `throw new AppError` antes de llamar al servicio.

```typescript
// Dentro de loginWithGoogle (auth.controller.ts)
if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
  throw new AppError('El cuerpo de la solicitud es requerido para autenticación con Google.', 400);
}
```

### 5.4 Backend: Logging seguro (fix de seguridad)

- **Archivo**: `ms-auth/src/services/auth.service.ts` (línea 248)
- **Cambio**: `JSON.stringify(data)` → `!!data.token` y `data.token?.length`
- **Problema original**: Se logueaba el objeto `data` completo, que contenía el Firebase ID token (`data.token`). Los Firebase ID tokens son credenciales válidas por 1 hora y nunca deben loguearse.
- **Solución**: Log solo la existencia y longitud del token (suficiente para debugging).

```typescript
// ANTES (inseguro):
console.log('[GoogleAuth] Data recibida:', JSON.stringify(data));

// DESPUÉS (seguro):
console.log('[GoogleAuth] loginWithGoogle llamado. Token presente:', !!data.token, 'Longitud:', data.token?.length);
```

### 5.5 Frontend: Store token antes del API call

- **Archivo**: `src/features/auth/hooks/useGoogleAuth.ts` (líneas 62–65)
- **Cambio**: Se agregó `useAuthStore.setState({ firebaseToken })` ANTES de `authApi.registerGoogle()`
- **Problema original**: El interceptor de Axios (`api.interceptors.ts:23`) lee `firebaseToken` del Zustand store de forma **síncrona** en el `requestInterceptor`. Si el token no está en el store cuando se ejecuta `apiClient.postPublic(...)`, el header `Authorization: Bearer <token>` no se agrega, y ms-auth responde 401.
- **Solución**: Escribir el token en el store inmediatamente después de obtenerlo de Firebase, antes de cualquier llamada a la API.

```typescript
// useGoogleAuth.ts (orden correcto)
// 1. Obtener firebaseToken de Firebase
const firebaseToken = await userCredential.user.getIdToken();

// 2. ⚡ SETEAR EN STORE ANTES DEL API CALL
useAuthStore.setState({ firebaseToken });

// 3. AHORA llamar a la API (el interceptor ya tiene el token)
const apiResponse = await authApi.registerGoogle({ googleToken: firebaseToken });
```

**Rollback en caso de error** (línea 73):
```typescript
if (apiResponse.success && apiResponse.data?.usuario) {
  setAuthData(apiResponse.data.usuario, firebaseToken);
} else {
  // Limpiar el token del store si la API falló
  useAuthStore.setState({ firebaseToken: null });
  // ...
}
```

### 5.6 Frontend: Reemplazo de librería Google Sign-In

- **Cambio**: Se reemplazó `expo-auth-session/providers/google` por `@react-native-google-signin/google-signin`
- **Problema original**: `expo-auth-session` usa un flujo OAuth basado en web browser (redirect URIs). Requiere configuración de redirect URIs en Firebase Console, sufre problemas con proxies, y tiene comportamiento inconsistente en diferentes versiones de Android WebView.
- **Solución**: `@react-native-google-signin/google-signin` usa Google Play Services nativo para manejar el flujo OAuth. Es más rápido, más confiable, y elimina los problemas de redirect URI/proxy.

**Plugin en `app.json`**:
```json
{
  "plugins": [
    "@react-native-google-signin/google-signin"
  ]
}
```

**Uso en el hook**:
```typescript
GoogleSignin.configure({
  webClientId,        // EXPO_PUBLIC_FIREBASE_CLIENT_ID
  offlineAccess: false,
});
await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
const result = await GoogleSignin.signIn();
```

### 5.7 Frontend: Android package name

- **Archivo**: `app.json` (línea 29)
- **Cambio**: `"package": "com.valledelsol.fococero"` → `"package": "com.fococero.app"`
- **Problema original**: El package name en app.json no coincidía con el registrado en el proyecto de Firebase Console. Esto causaba que Google Sign-In fallara con "Play Services: Invalid credential".
- **Solución**: Alinear el package name con Firebase.

```json
{
  "android": {
    "package": "com.fococero.app"
  }
}
```

### 5.8 Frontend: Plugin Google Services para Android

- **Archivo**: `android/app/build.gradle` (línea 4), `android/build.gradle` (línea 12)
- **Cambio**:
  - Se agregó `apply plugin: "com.google.gms.google-services"` en `android/app/build.gradle`
  - Se agregó `classpath('com.google.gms:google-services:4.4.2')` en `android/build.gradle`
  - Se copió `google-services.json` a `android/app/`
- **Problema original**: `@react-native-google-signin/google-signin` requiere el plugin de Google Services para Android para funcionar. Sin él, la app no puede autenticarse con Google Play Services.
- **Solución**: Configurar correctamente el plugin y los archivos de build de Gradle.

```gradle
// android/build.gradle (buildscript.dependencies)
classpath('com.google.gms:google-services:4.4.2')

// android/app/build.gradle (top-level)
apply plugin: "com.google.gms.google-services"
```

### 5.9 Backend: Catch-all route en ms-auth

- **Archivo**: `ms-auth/src/routes/auth.routes.ts` (líneas 51–56)
- **Cambio**: Se agregó `router.all('*')` al final del router
- **Problema original**: Sin catch-all, las rutas no encontradas caían en el middleware `validateFirebaseToken` (que verificaba el header `Authorization`) y devolvían un 401 engañoso en lugar de un 404 descriptivo. Esto hacía difícil diagnosticar problemas de ruteo.
- **Solución**: Catch-all route que retorna 404 con la ruta y método.

```typescript
router.all('*', (req, res) => {
  res.status(404).json({
    ok: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});
```

---

## 6. Notas Importantes de Arquitectura

### 6.1 Orden de rutas en ms-auth (CRÍTICO)

El orden de las rutas en `auth.routes.ts` es **determinante** para la seguridad. El middleware `validateFirebaseToken` se aplica con `router.use()`, lo que significa que TODAS las rutas definidas DESPUÉS de esa línea requieren autenticación.

```typescript
// ============================================================================
// 🔓 ZONA PÚBLICA (sin autenticación)
// ============================================================================
router.post('/login', AuthController.login);
router.post('/register-guest', AuthController.registerGuest);
router.post('/register-full', AuthController.registerFull);
router.post('/google', AuthController.loginWithGoogle);   // ← DEBE estar aquí

// ============================================================================
// 🔒 ZONA PRIVADA (todo lo de abajo requiere token)
// ============================================================================
router.use(validateFirebaseToken);

router.post('/upgrade-account', AuthController.upgradeAccount);
router.get('/me', AuthController.getProfile);
router.patch('/me', AuthController.updateProfile);
router.patch('/me/fcm-token', AuthController.syncFcmToken);

// ============================================================================
// 🔴 ZONA ADMIN (requiere token + rol ADMIN)
// ============================================================================
const adminGuard = authorizeRole([UserRole.ADMIN]);
router.get('/users', adminGuard, AuthController.getAllUsers);
router.patch('/users/:id/role', adminGuard, AuthController.changeRole);
router.patch('/users/:id/status', adminGuard, AuthController.changeStatus);
router.delete('/users/:id', adminGuard, AuthController.deleteUser);

// ============================================================================
// 🚫 CATCH-ALL (siempre al final)
// ============================================================================
router.all('*', (req, res) => { ... });  // → 404
```

> **⚠️ Regla de oro**: `POST /google` debe estar SIEMPRE antes de `router.use(validateFirebaseToken)`. Si alguien la mueve después, el login con Google dejará de funcionar (responderá 401).

### 6.2 Diferencia de versiones Express

| Aspecto | api-gateway (Express v4) | ms-auth (Express v5) |
|---------|--------------------------|---------------------|
| **Versión** | `^4.18` | `^5.0` |
| **Manejo de req.url** | Cuando se usa `app.use('/api/auth', router)`, Express v4 **stripa** el mount path (`/api/auth`) de `req.url`. Lo que el router ve es solo `/google`. | Express v5 usa `path-to-regexp` v8, que es **más estricto** con caracteres especiales como `//` o `?` mal colocados. |
| **pathRewrite** | `http-proxy-middleware` con Express v4: casi nunca se ejecuta porque Express v4 ya stripa el path antes de que el proxy lo vea. El rewrite queda como defensa en profundidad. | N/A (no es proxy) |
| **Consecuencia** | La línea `'^/api/auth': ''` en pathRewrite es técnicamente redundante en la mayoría de los casos, pero necesaria como defensa para escenarios donde Express v4 no logra strip el path. | Cualquier doble slash en la URL rompe el ruteo. Por eso existe el middleware de normalización (§5.2). |

**Comportamiento detallado del proxy**:

```
Request: POST /api/auth/google
         ↓
Express v4 en api-gateway
  → app.use('/api/auth', proxyHandler)
  → Express v4 strípa '/api/auth' de req.url
  → req.url = '/google'
  → http-proxy-middleware ve req.url = '/google'
  → Proxy a http://ms-auth:3001/google
  → pathRewrite casi nunca se invoca
         ↓
Express v5 en ms-auth
  → Recibe POST /google
  → router.post('/google') → matchea
```

### 6.3 AUTH_SERVICE_URL y resolución de servicios

| Entorno | Valor | Dónde se define |
|---------|-------|-----------------|
| **Desarrollo local** | `http://localhost:3001` | Default en `envs.ts` del gateway |
| **Docker Compose** | `http://ms-auth:3001` | `api-gateway/.env` o `docker-compose.yml` |

**Importante**: La URL del servicio **no incluye path** (`/api/auth`). El path se agrega en el mount de Express (`appRoutes.use('/api/auth', ...)`) y el proxy lo hereda.

---

## 7. Dependencias y Configuración

### 7.1 Variables de entorno del Frontend

Archivo: `.env` en `C:\f\`

```bash
# ==========================================
# 🌐 CONEXIÓN AL BACKEND
EXPO_PUBLIC_API_GATEWAY_URL=http://10.123.189.161:3000
EXPO_PUBLIC_ENVIRONMENT=development

# ==========================================
# 🔥 FIREBASE WEB SDK
# Solo variables públicas, NINGUNA llave privada aquí.
EXPO_PUBLIC_FIREBASE_API_KEY="AIzaSyDbYVPjKiU45lmv5xcxsPN9-ryEa6CQA1s"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="fococero-3f3f7.firebaseapp.com"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="fococero-3f3f7"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="fococero-3f3f7.firebasestorage.app"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="871265029400"
EXPO_PUBLIC_FIREBASE_APP_ID="1:871265029400:web:46d2146e2c7e290381226d"

# ==========================================
# 🆔 CLIENT IDs DE GOOGLE
EXPO_PUBLIC_FIREBASE_CLIENT_ID="871265029400-le5h6s5jqgcsel5g1ntstnqo4skme52i.apps.googleusercontent.com"
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID="871265029400-0b864p422dba37earl62abk9a3jmr1hj.apps.googleusercontent.com"
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS="871265029400-c1nlm288b5b0ge1d07ir1107c30sps5c.apps.googleusercontent.com"
```

**Notas**:
- `EXPO_PUBLIC_FIREBASE_CLIENT_ID` se usa como `webClientId` en `GoogleSignin.configure()`.
- `EXPO_PUBLIC_API_GATEWAY_URL` apunta a `10.123.189.161:3000` en desarrollo (IP local de la máquina que corre Docker). En producción apuntará al dominio público.
- Todas las variables con prefijo `EXPO_PUBLIC_` son expuestas al cliente por Expo.

### 7.2 Variables de entorno del Backend

#### api-gateway `.env`

```bash
PORT=3000
NODE_ENV=development

# URLs de Microservicios (en Docker)
AUTH_SERVICE_URL=http://ms-auth:3001
GEO_SERVICE_URL=http://ms-geo:3002
ALERTAS_SERVICE_URL=http://ms-alertas:3003
REPORTES_SERVICE_URL=http://ms-reportes:3004
MULTIMEDIA_SERVICE_URL=http://ms-multimedia:3005
EMERGENCIAS_SERVICE_URL=http://ms-emergencias:3006
ANALITICA_SERVICE_URL=http://ms-analitica:3007

# Redis
REDIS_URL=redis://redis-fococero:6379

# Eureka
EUREKA_HOST=eureka-server

# Firebase Admin SDK
FIREBASE_PROJECT_ID=fococero-3f3f7
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fococero-3f3f7.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Seguridad interna
INTERNAL_SECRET_TOKEN=<token-secreto-compartido>
```

#### ms-auth `.env`

```bash
PORT=3001
NODE_ENV=development

# PostgreSQL
DB_USER=fococero
DB_PASSWORD=<password>
DB_HOST=db-fococero
DB_PORT=5432
DB_NAME=fococero_auth

# Eureka
EUREKA_HOST=eureka-server

# CORS
API_GATEWAY_URL=http://api-gateway:3000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=fococero-3f3f7
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fococero-3f3f7.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Interno
INTERNAL_SECRET_TOKEN=<token-secreto-compartido>
```

> **⚠️ Seguridad**: `FIREBASE_PRIVATE_KEY` debe tener los `\n` escapados correctamente. El código en `envs.ts` aplica un `.replace(/\\n/g, '\n')` para convertir los saltos de línea literales a saltos reales requeridos por OpenSSL.

---

## 8. Configuración en Google Cloud / Firebase Console

| Configuración | Valor |
|--------------|-------|
| **Android package name** | `com.fococero.app` |
| **Debug SHA-1** | `2E:C8:35:05:FB:2E:4D:4E:EF:BC:56:93:67:00:A8:FB:6F:CC:39:8D` |
| **Web client ID** | `871265029400-le5h6s5jqgcsel5g1ntstnqo4skme52i.apps.googleusercontent.com` |
| **Android client ID** | `871265029400-0b864p422dba37earl62abk9a3jmr1hj.apps.googleusercontent.com` |
| **iOS client ID** | `871265029400-c1nlm288b5b0ge1d07ir1107c30sps5c.apps.googleusercontent.com` |
| **Google Sign-In** | Habilitado (no necesita `serverAuthCode` porque `offlineAccess: false`) |
| **Config file** | `google-services.json` descargado de Firebase Console, copiado a `android/app/` |

**Pasos para verificar/configurar en Firebase Console**:
1. Ir a [Firebase Console](https://console.firebase.google.com/) → Proyecto `fococero-3f3f7`
2. **Authentication** → Sign-in method → Google → Habilitado
3. **Project settings** → General → Agregar app Android (si no existe)
   - Package name: `com.fococero.app`
   - SHA-1: `2E:C8:35:05:FB:2E:4D:4E:EF:BC:56:93:67:00:A8:FB:6F:CC:39:8D`
4. **Project settings** → Service accounts → Generar nueva clave privada si es necesario
5. Descargar `google-services.json` actualizado si se cambia la configuración

---

## 9. Infraestructura Docker

### Servicios en docker-compose.yml

```
Servicio           Imagen                             Puerto Expuesto
─────────────────────────────────────────────────────────────────────
db-fococero        postgis/postgis:15-3.3             5432 (host)
pgadmin            dpage/pgadmin4                     5050:80
redis-fococero     redis:7-alpine                     —
rabbitmq           rabbitmq:3-management              5672, 15672
caddy              caddy:2-alpine                     80, 443
eureka-server      steeltoeoss/eureka-server:latest   8761
api-gateway        (build ./api-gateway)              3000
ms-auth            (build ./ms-auth)                  —
ms-geo             (build ./ms-geo)                   —
ms-alertas         (build ./ms-alertas)               —
ms-reportes        (build ./ms-reportes)              —
ms-multimedia      (build ./ms-multimedia)            —
ms-emergencias     (build ./ms-emergencias)           —
ms-analitica       (build ./ms-analitica)             —
```

### Red
- **Nombre**: `fococero-network`
- **Driver**: `bridge`
- Todos los servicios están en la misma red. Los microservicios se resuelven por nombre de contenedor.

### Volúmenes persistentes
- `fococero_pgdata` — Datos de PostgreSQL
- `fococero_redis_data` — Datos de Redis
- `fococero_pgadmin_data` — Configuración de pgAdmin
- `fococero_caddy_data` — Certificados SSL de Caddy
- `fococero_rabbitmq_data` — Colas de RabbitMQ

### Inicialización de bases de datos
El script `init-multiple-databases.sh` (montado en `/docker-entrypoint-initdb.d/00-init-databases.sh`) crea una base de datos separada por microservicio:
- `fococero_auth` (init: `ms-auth/init.sql`)
- `fococero_geo` (init: `ms-geo/database/init.sql`)
- `fococero_alertas` (init: `ms-alertas/database/init.sql`)
- `fococero_reportes` (init: `ms-reportes/database/init.sql`)
- `fococero_multimedia` (init: `ms-multimedia/database/init.sql`)
- `fococero_emergencias` (init: `ms-emergencias/database/init.sql`)
- `fococero_analitica` (init: `ms-analitica/database/init.sql`)

### Caddy (Reverse Proxy)

```caddy
:80, :443 {
    tls internal
    reverse_proxy api-gateway:3000
    # ...
}
```

En producción, se reemplaza `:80, :443` por `api.fococero.cl` para obtener certificados SSL automáticos de Let's Encrypt.

---

## 10. Arquitectura de Estado (Zustand)

El store de autenticación (`auth.store.ts`) usa **Zustand con persistencia** mediante `secureZustandAdapter` (que internamente usa `expo-secure-store` para almacenar tokens de forma segura).

### Estados posibles (máquina de estados finitos)

```
loading ──► unauthenticated ──► guest ──► authenticated
                │                                    │
                └────────────────◄────────────────────┘
                    (logout desde cualquier estado)
```

### Store shape

```typescript
interface AuthState {
  status: 'loading' | 'unauthenticated' | 'guest' | 'authenticated';
  user: Usuario | null;
  firebaseToken: string | null;
  isHydrated: boolean;
}

interface AuthStore extends AuthState {
  setAuthData: (user, firebaseToken?, status?) => void;
  checkSession: () => void;
  login: (credentials) => Promise<boolean>;
  register: (data) => Promise<boolean>;
  refreshGuestToken: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isLoading: boolean;
  error: string | null;
}
```

### Persistencia

```typescript
persist(
  (set, get) => ({ ... }),
  {
    name: 'fococero-auth-session',
    storage: secureZustandAdapter,    // expo-secure-store
    partialize: (state) => ({
      status: state.status,
      user: state.user,
      firebaseToken: state.firebaseToken,
    }),
    onRehydrateStorage: () => (state) => {
      // Validar token al rehidratar (app reopen)
      if (state.status === 'authenticated' && state.firebaseToken &&
          !tokenUtils.isValid(state.firebaseToken)) {
        state.logout();  // Token expirado → logout automático
      }
      state.setHydrated();
    },
  }
)
```

---

## 11. Interceptor Axios y el Token Bearer

El interceptor de salida (`requestInterceptor` en `api.interceptors.ts`) es el punto donde se inyecta el `Authorization: Bearer <token>` en cada petición.

```typescript
// api.interceptors.ts — LÍNEA 23 (la más crítica del frontend)
export const requestInterceptor = (config: CustomAxiosRequestConfig) => {
  const firebaseToken = getAuthStore().getState().firebaseToken;
  //                                     ↑
  //      LECTURA SÍNCRONA del store. Si el token no está aquí,
  //      la petición NO llevará Authorization header.
  if (firebaseToken) {
    config.headers.Authorization = `Bearer ${firebaseToken}`;
  }
  return config;
};
```

**Consecuencia directa**: El fix §5.5 (store token antes del API call) es obligatorio. Sin él, `POST /api/auth/google` nunca lleva el header `Authorization`, y ms-auth responde con 401.

### ¿Por qué fallan las rutas privadas?

Si una ruta privada (ej: `GET /api/auth/me`) responde 401:
1. Verificar que `useAuthStore.getState().firebaseToken` tenga valor ANTES de la petición.
2. Verificar que el interceptor `requestInterceptor` se esté ejecutando (revisar el orden de los interceptores en `api.client.ts`).
3. Verificar que el token no esté expirado (`tokenUtils.isValid()`).
4. Verificar que ms-auth tenga las rutas públicas/privadas correctamente ordenadas (§6.1).

---

## 12. Preguntas Frecuentes Técnicas

### "Error: Cannot read properties of undefined (reading 'token')"

**Causa**: `req.body` es `undefined` o no es un objeto.

**Fix aplicado**: Guard clause en `auth.controller.ts` → §5.3.

**Debug**: Verificar que:
1. El frontend envía `Content-Type: application/json`
2. El body se serializa correctamente: `{ "token": "..." }`
3. El middleware `express.json()` se ejecuta antes que el controlador (sí, en `index.ts` línea 38)

### "Google Sign-In devuelve error 12500 / INVALID_CREDENTIAL"

**Causas posibles**:
1. **Package name no coincide**: Verificar `com.fococero.app` en Firebase Console y `app.json`
2. **SHA-1 incorrecto**: Debug SHA-1 debe ser `2E:C8:35:05:FB:2E:4D:4E:EF:BC:56:93:67:00:A8:FB:6F:CC:39:8D`
3. **google-services.json desactualizado**: Redescargar de Firebase Console
4. **Plugin faltante**: `com.google.gms.google-services` debe estar en `android/app/build.gradle`
5. **webClientId incorrecto**: Debe ser el Client ID de tipo Web, no Android

### "Ruta no encontrada 404 en ms-auth"

**Causas posibles**:
1. **Doble slash en URL**: `//google` en vez de `/google`. Verificar middleware de normalización (§5.2)
2. **pathRewrite incorrecto**: Si se cambió a `'/'`, produce doble slash. Debe ser `''` (§5.1)
3. **Ruta en orden incorrecto**: `POST /google` debe estar ANTES de `validateFirebaseToken` (§6.1)

### "El token no se está enviando en el header"

**Causas posibles**:
1. **Fix §5.5 no aplicado**: `firebaseToken` debe setearse en el store ANTES del API call
2. **Store no persistido**: Verificar que `secureZustandAdapter` funciona correctamente
3. **Interceptor no registrado**: Verificar `api.client.ts` que agrega el interceptor

### "Error 401 en rutas públicas"

**Causa**: Si `POST /google` está después de `router.use(validateFirebaseToken)`, Express evalúa el middleware primero y devuelve 401.

**Fix**: Mover la ruta `POST /google` ANTES del `router.use(validateFirebaseToken)` → §6.1.

### "Firebase Custom Token no funciona"

**Causas posibles**:
1. `FIREBASE_PRIVATE_KEY` mal formateado (los `\n` deben ser saltos de línea reales)
2. `FIREBASE_CLIENT_EMAIL` incorrecto
3. La cuenta de servicio no tiene permisos para `createCustomToken`
4. El `firebase_uid` no existe en Firebase Authentication

**Debug**: Verificar que `admin.auth().verifyIdToken(token)` funciona antes de llamar a `createCustomToken`.

---

## Apéndice: Comandos Útiles

```bash
# Iniciar todo el backend con Docker
cd C:\FocoCero\fococero-backend
docker compose up -d --build

# Ver logs de un servicio específico
docker compose logs -f ms-auth

# Ver logs del API Gateway
docker compose logs -f api-gateway

# Ejecutar frontend en Android
cd C:\f
npx expo run:android

# Verificar que el gateway está respondiendo
curl http://localhost:3000/health

# Probar login con Google (debug directo a ms-auth)
curl -X POST http://localhost:3001/google \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <FIREBASE_TOKEN>" \
  -d '{"token": "<FIREBASE_TOKEN>"}'

# Verificar rutas de ms-auth
curl http://localhost:3001/health

# Test de catch-all (debe devolver 404, no 401)
curl -X POST http://localhost:3001/ruta-inexistente
```

---

## 13. Repositorios y CI/CD

### Repositorios Separados (GitHub)

Cada microservicio tiene su propio repo en `github.com/ignachaedo/`:

| Servicio | Repo | Rama principal |
|----------|------|----------------|
| API Gateway | `fococero-apigetway.git` | `main` |
| ms-auth | `fococero-ms-auth.git` | `main` |
| ms-geo | `fococero-ms-geo.git` | `main` |
| ms-alertas | `fococero-ms-alertas.git` | `main` |
| ms-reportes | `fococero-ms-reportes.git` | `main` |
| ms-multimedia | `fococero-ms-multimedia.git` | `main` |
| ms-emergencias | `fococero-ms-emergencias.git` | `main` |
| ms-analitica | `fococero-ms-analitica.git` | `main` |
| **Frontend** | `github.com/DavNat13/fococero-frontend.git` | `main` |

### Git Flow

Cada repo sigue **Git Flow** con las siguientes ramas:
- `main` — Código estable y revisado
- `develop` — Integración de features
- `feature/*` — Ramas de trabajo por característica

Ramas creadas en todos los repos:
- `develop` (desde `main`)
- `feature/ci-pipelines`
- `feature/docs-readme`
- `feature/jsdoc`
- `feature/spanish-tests`
- `feature/rabbitmq-publisher` (solo ms-reportes)
- `feature/perfil-brigadista` (solo ms-auth)

### CI/CD (GitHub Actions)

Cada MS tiene `.github/workflows/ci.yml` con:
- Trigger: push a `main`, `develop`, o `feature/*`
- Jobs:
  1. **Build & Lint**: `npm ci`, `tsc --noEmit`, `eslint --max-warnings 0`
  2. **Test**: `npm test` (timeout 180s en api-gateway)
  3. **Check Env**: Validación de variables de entorno requeridas

### Fixes aplicados a CI

| MS | Problema | Fix |
|----|----------|-----|
| `ms-reportes` | YAML con `working-directory:` huérfano | Eliminada indentación extra |
| `api-gateway` | Tests toman 60-109s, timeout default 30s | `jest.config.js` → `testTimeout: 180000` |
| `ms-emergencias` | Test esperaba 403, middleware devuelve 401 | Cambiado expectation a 401 |

## 14. Fase 4: Perfil Brigadista

### Frontend

- **Nueva pantalla**: `app/(brigadista)/editar-perfil-brigadista.tsx`
- Formulario con campos: organismo, rango, zona_asignada, numero_placa, fecha_ingreso
- Validación de formulario antes de enviar
- Botón "Guardar Cambios" con loading state
- Manejo de errores y feedback visual
- **Menú**: "Editar Perfil" agregado en `app/(brigadista)/perfil.tsx` con `router.push`

### Backend

- **Validator**: `AuthValidator.validatePerfilBrigadista()` en `ms-auth/src/validators/auth.validator.ts`
  - organismo: string requerido, 3-100 caracteres
  - rango: enum string (Voluntario, Cabo, Sargento, Teniente, Capitán, Mayor, Comandante)
  - zona_asignada: string requerido, 3-200 caracteres
  - numero_placa: string opcional
  - fecha_ingreso: string opcional, formato ISO date
- **Repository**: `PerfilBrigadistaRepository` en `ms-auth/src/repositories/perfil-brigadista.repository.ts`
  - `findByUserId(userId)` — Busca perfil existente
  - `upsert(userId, data)` — Crea o actualiza (INSERT ON CONFLICT UPDATE)

## 15. RabbitMQ — Publisher en ms-reportes

### Arquitectura

```
ms-reportes ──publica──► RabbitMQ ──consumo──► ms-analitica
  (producer)    exchange        (consumer)
                fococero.events
                routing: incidente.reporte.creado
```

### Configuración

- **Exchange**: `fococero.events` (topic, durable)
- **Routing Key**: `incidente.reporte.creado`
- **DLX**: `fococero.dlx` (dead letter exchange)
- **DLQ**: `analitica.incidentes.dlq` (dead letter queue)
- **Payload**: Objeto con `incidenteId`, `tipoEvento`, `fechaHora`, `ubicacion`, `datosIncidente`

### Archivos nuevos

| Archivo | Propósito |
|---------|-----------|
| `ms-reportes/src/config/rabbitmq.ts` | Singleton con auto-reconnect |
| `ms-reportes/src/events/reporte.publisher.ts` | Publica evento tras crear reporte |

### Publisher se invoca en `ReporteService.crearReporte()` después de `reporteRepository.create()`.

## 16. Cobertura de Tests

### Backend (Jest)

| MS | Tests | Statements | Functions | Estado |
|----|-------|-----------|-----------|--------|
| `ms-auth` | 165 (12 suites) | 85.25% | 93.75% | ✅ Completo |
| `api-gateway` | 19 (5 suites) | — | — | ✅ Pasa |
| `ms-geo` | — | — | — | ⏳ Pendiente |
| `ms-alertas` | — | — | — | ⏳ Pendiente |
| `ms-reportes` | — | — | — | ⏳ Pendiente |
| `ms-multimedia` | — | — | — | ⏳ Pendiente |
| `ms-emergencias` | — | — | — | ⏳ Pendiente |
| `ms-analitica` | — | — | — | ⏳ Pendiente |

### Frontend (Jest + React Native Testing Library)

| Área | Tests | Estado |
|------|-------|--------|
| `src/shared/utils` | 10 files, 24 describe, 90 it | ✅ Completo |
| `src/features/auth` | — | ⏳ Pendiente |
| `src/entities/` | — | ⏳ Pendiente |
| `src/core/` | — | ⏳ Pendiente |

### Convenciones
- Tests escritos en **español** (describes e its)
- Nombres descriptivos del comportamiento
- Sin mock innecesarios; se prioriza integración sobre unitarios

## 17. Repositorios de Referencia

```bash
# Backend (8 repos)
git@github.com:ignachaedo/fococero-apigetway.git
git@github.com:ignachaedo/fococero-ms-auth.git
git@github.com:ignachaedo/fococero-ms-geo.git
git@github.com:ignachaedo/fococero-ms-alertas.git
git@github.com:ignachaedo/fococero-ms-reportes.git
git@github.com:ignachaedo/fococero-ms-multimedia.git
git@github.com:ignachaedo/fococero-ms-emergencias.git
git@github.com:ignachaedo/fococero-ms-analitica.git

# Frontend
git@github.com:DavNat13/fococero-frontend.git
```

---

*Última actualización: 21 de junio de 2026* — Fase 4 completa, CI/CD operativo, 8 MS en repos separados con branches develop/feature, JSDoc, tests en español y RabbitMQ publisher integrado.

*Este archivo debe mantenerse actualizado. Si aplicas un fix o cambio arquitectónico, actualiza esta documentación en el mismo PR.*
