# Usuarios — Gestion de Usuarios (integrado en ms-auth, puerto 3001)

## Descripcion General

Modulo de administracion de usuarios integrado en ms-auth. Permite gestion completa del ciclo de vida de cuentas: creacion, asignacion de roles, control de estado, busqueda y autogestion de perfil. Es el pilar del modelo RBAC del sistema.

## Endpoints de Administracion (solo ADMIN)

| Metodo | Endpoint | Descripcion |
|---|---|---|
| GET | /auth/admin/users | Listar usuarios (paginado, filtros) |
| GET | /auth/admin/users/:id | Obtener usuario por ID |
| POST | /auth/admin/users | Crear usuario manualmente |
| PATCH | /auth/admin/users/:id/rol | Cambiar rol de usuario |
| PATCH | /auth/admin/users/:id/estado | Cambiar estado (activo/inactivo) |
| DELETE | /auth/admin/users/:id | Soft delete (desactivacion) |
| GET | /auth/admin/users/search | Buscar usuarios por termino |

## Endpoints de Autogestion

| Metodo | Endpoint | Rol | Descripcion |
|---|---|---|---|
| GET | /auth/me | TODOS | Obtener perfil propio |
| PATCH | /auth/me | TODOS | Actualizar nombre, foto, preferencias |
| PATCH | /auth/me/fcm-token | TODOS | Sincronizar token de dispositivo |

## Modelo de Datos

```
User {
  id: UUID (PK)
  firebase_uid: string (UNIQUE, nullable para guest)
  email: string (UNIQUE, nullable para guest)
  nombre: string
  foto_url: string (nullable)
  rol: enum(CIUDADANO, BRIGADISTA, ADMIN)
  estado: enum(activo, inactivo)  // default: activo
  device_id: string (nullable, para guest)
  ultimo_acceso: timestamp
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (nullable, soft delete)
}
```

## Asignacion de Roles

### Jerarquia de Roles

```
CIUDADANO → BRIGADISTA → ADMIN
```

- Las transiciones solo pueden ser hacia adelante o mantenerse
- ADMIN no puede degradarse a si mismo (evita lockout)
- Solo ADMIN puede cambiar roles
- El cambio de rol registra auditoria: `{ usuario_id, rol_anterior, rol_nuevo, admin_id, timestamp }`

### Estados de Cuenta

| Estado | Descripcion | Efecto |
|---|---|---|
| activo | Cuenta operativa | Acceso completo segun rol |
| inactivo | Cuenta desactivada | No puede autenticarse; JWT rechazado en Gateway |
| deleted (soft) | Cuenta eliminada | invisible en listados; datos preservados por auditoria |

## Busqueda y Listado

- `GET /auth/admin/users?page=1&limit=20&rol=CIUDADANO&estado=activo&search=texto`
- Busqueda por: email, nombre (ILIKE)
- Paginacion con cursor-based pagination para performance
- Resultados excluyen campo `firebase_uid` por seguridad

## Gestion de FCM Tokens

- `PATCH /auth/me/fcm-token` — payload: `{ fcmToken: "string" }`
- Almacena hasta 5 tokens por usuario (multi-dispositivo)
- Tokens antiguos se rotan automaticamente (LRU)
- Envio de notificaciones push segmentado por rol via FCM topics
- Ciudadanos: topic `ciudadanos`; Brigadistas: topic `brigadistas`; Admin: topic `admins`

## Seguridad y Privacidad

- Datos personales minimos: solo `nombre, email, foto_url`
- Password nunca almacenada en ms-auth (delegado a Firebase Auth)
- `firebase_uid` no se expone en respuestas API (solo uso interno)
- Historial de cambios de rol inmutable con auditoria
- Soft delete preserva datos para cumplimiento legal (Ley 19.628 Chile)

## DevOps

- Migraciones con seed inicial: admin@fococero.cl (rol ADMIN)
- Indices UNIQUE en email y firebase_uid para integridad referencial
- Worker cron semanal: limpieza de guest accounts > 30 dias sin conversion
- Alertas en Grafana si tasa de creacion de usuarios > 3 sigma del promedio

## Vulnerabilidades

| Vulnerabilidad | Mitigacion |
|---|---|
| Privilege escalation por admin | Auditoria de cambios de rol + alerta si ADMIN crea otro ADMIN |
| Account enumeration en busqueda | Respuesta generica "usuario no encontrado" sin diferenciar existencia |
| Guest account persistente | TTL de 24h para guest sin conversion; purge semanal |
| FCM token poisoning | Validacion de formato token + maximo 5 por usuario |
| Self-degrade de ADMIN | Validacion: ADMIN no puede cambiar su propio rol a inferior |
