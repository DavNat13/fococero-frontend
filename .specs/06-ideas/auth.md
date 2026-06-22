# Autenticacion — ms-auth (puerto 3001)

## Descripcion General

Microservicio central de identidad. Gestiona registro, autenticacion, perfiles de usuario y sincronizacion de dispositivos via FCM tokens. Integra Firebase Authentication como proveedor OAuth delegando la verificacion de identidad al Admin SDK de Firebase.

## Flujo de JWT

```
[Cliente] → POST /auth/login → [ms-auth] → verify Firebase ID token
 → generate JWT custom → [Cliente recibe JWT + refresh]
 → Almacena en SecureStore (expo-secure-store)
 → Envia en header Authorization: Bearer <jwt>
 → [Gateway Kong] verify JWT via Firebase Admin SDK
 → Gateway extrae uid + role del payload → propaga a microservicios via header X-User-*
```

### Token Lifecycle

1. **Obtencion**: Login exitoso retorna `{ accessToken, refreshToken, expiresIn: 900 }`
2. **Almacenamiento**: `expo-secure-store` en dispositivo movil; nunca en AsyncStorage
3. **Envio**: Header `Authorization: Bearer <accessToken>` en cada request
4. **Verificacion**: Gateway Kong verifica contra Firebase Admin SDK; si es valido, propaga
5. **Propagacion**: Gateway inyecta `X-User-Id`, `X-User-Role`, `X-User-Email` a microservicios
6. **Refresh**: `POST /auth/refresh` con refresh token rotativo (rotation policy)

## Registro de Usuarios

### Guest Access
- `POST /auth/register/guest` — crea usuario con permisos limitados
- Payload: `{ deviceId, fcmToken? }`
- Se asigna rol `CIUDADANO` automaticamente
- TTL de cuenta: 24h sin conversion a cuenta completa

### Full Registration
- `POST /auth/register` — registro completo con Firebase UID
- Payload: `{ firebaseUid, email, nombre, foto?, fcmToken? }`
- Flujo: Frontend hace signInWithFirebase → obtiene UID → envia a ms-auth
- Se asigna rol `CIUDADANO` por defecto

## Login

- `POST /auth/login` — email/password via Firebase REST API
- `POST /auth/login/google` — Google OAuth via Firebase credential
- Ambos retornan JWT + refresh token + datos de perfil

## Perfil de Usuario

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | /auth/me | Obtener perfil propio | JWT |
| PATCH | /auth/me | Actualizar nombre, foto, preferencias | JWT |
| PATCH | /auth/me/fcm-token | Sincronizar FCM token | JWT |

### Clean Architecture

```
[Routes] → [Controller] → [UseCase] → [Repository] → [Model]
   ↓            ↓
[JWT Guard] [Validation]
   ↓
[Firebase Admin SDK]
```

## Administracion de Usuarios (solo ADMIN)

| Metodo | Endpoint | Descripcion |
|---|---|---|
| GET | /auth/admin/users | Listar todos los usuarios |
| GET | /auth/admin/users/:id | Obtener usuario por ID |
| POST | /auth/admin/users | Crear usuario |
| PATCH | /auth/admin/users/:id | Cambiar rol, estado |
| DELETE | /auth/admin/users/:id | Soft delete |

## Seguridad

- **JWT**: Firmado por Firebase; TTL 15 minutos; refresh token 7 dias con rotation
- **Rate Limit**: 5 intentos fallidos por minuto bloquea IP por 30 min
- **Password**: Firebase maneja hashing bcrypt + pepper server-side
- **Privacidad**: Solo campos `id, nombre, email, foto, rol, estado` expuestos en API
- **Auditoria**: Log de todos los login/register/role-change con IP y timestamp

## DevOps

- Health check: `GET /auth/health` → `{ status: "ok", db: "connected", firebase: "connected" }`
- Migraciones: Sequelize con semver en nombres de archivo
- Cache: Redis 7 para sesiones de refresh token

## Vulnerabilidades y Mitigaciones

| Vulnerabilidad | Mitigacion |
|---|---|
| Token interceptado | SecureStore + HTTPS obligatorio + TTL corto |
| Account enumeration | Mensaje generico "credenciales invalidas" |
| Brute force | Rate limiting por IP + Firebase Auth bloqueo automatico |
| Privilege escalation | Validacion de rol en cada endpoint; Gateway verifica claims |
| Replay attack | JWT con jti unico + exp window 15 min |
