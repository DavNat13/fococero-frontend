# RBAC — Matriz de Permisos

## Descripcion General

Modelo de control de acceso basado en roles (RBAC) que gobierna toda la plataforma FocoCero. Define exactamente que puede hacer cada rol en cada microservicio, con validacion en tres capas: Gateway, API y Frontend.

## Roles del Sistema

| Rol | Codigo | Prioridad | Descripcion |
|---|---|---|---|
| Ciudadano | CIUDADANO | 10 | Usuario estandar, reporta y consulta |
| Brigadista | BRIGADISTA | 20 | Personal de emergencia, gestiona operaciones |
| Admin | ADMIN | 30 | Administrador del sistema, control total |

## Matriz de Permisos Detallada

| Microservicio | Recurso | Accion | CIUDADANO | BRIGADISTA | ADMIN |
|---|---|---|---|---|---|
| **ms-auth** | /auth/register | CREATE | SI | - | - |
| | /auth/login | READ | SI | SI | SI |
| | /auth/me | READ | SI | SI | SI |
| | /auth/me | UPDATE | SI | SI | SI |
| | /auth/me/fcm-token | UPDATE | SI | SI | SI |
| | /auth/admin/users | READ | - | - | SI |
| | /auth/admin/users | CREATE | - | - | SI |
| | /auth/admin/users/:id/rol | UPDATE | - | - | SI |
| | /auth/admin/users/:id/estado | UPDATE | - | - | SI |
| | /auth/admin/users/:id | DELETE | - | - | SI |
| **ms-alertas** | /api/alertas | READ | SI | SI | SI |
| | /api/alertas | CREATE | - | SI | SI |
| | /api/alertas/:id/estado | UPDATE | - | SI | SI |
| | /api/alertas/:id/verificar | UPDATE | - | SI | SI |
| | /api/alertas/:id | DELETE | - | - | SI |
| **ms-reportes** | /api/reportes | CREATE | SI | SI | SI |
| | /api/reportes/mis-reportes | READ | SI | SI | SI |
| | /api/reportes/:id | READ | SI | SI | SI |
| | /api/reportes/:id | UPDATE | PROPIO | SI | SI |
| | /api/reportes/:id/estado | UPDATE | - | SI | SI |
| | /api/reportes/:id | DELETE | PROPIO | SI | SI |
| **ms-geo** | /api/geo | READ | SI | SI | SI |
| | /api/geo | CREATE | SI | SI | SI |
| | /api/geo/:id/estado | UPDATE | - | SI | SI |
| | /api/geo/:id/perimetro | UPDATE | - | SI | SI |
| **ms-emergencias** | /api/emergencias/despachos | CREATE | - | SI | SI |
| | /api/emergencias/despachos | READ | - | SI | SI |
| | /api/emergencias/despachos/retry | CREATE | - | - | SI |
| **ms-analitica** | /api/analitica/ops/* | READ | - | SI | SI |
| | /api/analitica/core/* | READ | - | SI | SI |
| | /api/analitica/espacial/* | READ | - | SI | SI |
| | /api/analitica/predictiva/* | READ | - | - | SI |
| | /api/analitica/exportar/* | READ | - | - | SI |
| **ms-multimedia** | /api/multimedia/upload | CREATE | SI | SI | SI |
| | /api/multimedia/:id | READ | SI | SI | SI |
| | /api/multimedia/:id | DELETE | PROPIO | PROPIO | SI |

## Implementacion en Tres Capas

### 1. Gateway (Kong) — Validacion de JWT

```javascript
// Middleware en Gateway: decodifica JWT, extrae claims
// Inyecta headers a microservicios internos:
//   X-User-Id: uid
//   X-User-Role: CIUDADANO|BRIGADISTA|ADMIN
//   X-User-Email: email
// Rechaza 401 si JWT invalido o expirado
// Rechaza 403 si rol no tiene permiso para la ruta base
```

### 2. API (Microservicios) — Middleware authorizeRole

```javascript
// Middleware en cada microservicio
function authorizeRole(...rolesPermitidos) {
  return (req, res, next) => {
    const role = req.headers['x-user-role'];
    if (!rolesPermitidos.includes(role)) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'No tienes permisos para esta operacion'
      });
    }
    next();
  };
}

// Uso en ruta:
// router.patch('/:id/estado', authorizeRole('BRIGADISTA', 'ADMIN'), handler);
```

### 3. Frontend (Expo Router) — Route Guards

```javascript
// Guard en layout de Expo Router
function RBACGuard({ rolesPermitidos, children }) {
  const { user } = useAuth();
  
  if (!user) return <Redirect href="/login" />;
  if (!rolesPermitidos.includes(user.rol)) {
    return <Redirect href="/unauthorized" />;
  }
  return children;
}

// Uso en rutas:
// <RBACGuard rolesPermitidos={['BRIGADISTA', 'ADMIN']}>
//   <Stack />
// </RBACGuard>
```

## Reglas de Negocio Adicionales

- **Propio**: Un usuario puede modificar/eliminar recursos que el mismo creo
- **Jerarquia**: ADMIN puede hacer todo lo que BRIGADISTA puede, y BRIGADISTA todo lo que CIUDADANO puede (herencia ascendente)
- **Excepciones**: Los endpoints publicos GET de ms-geo no requieren autenticacion
- **Guest**: Tiene permisos de CIUDADANO pero con TTL 24h y limitado a 3 reportes/dia

## Seguridad y Privacidad

- Nunca confiar en el rol del frontend; siempre validar en backend
- Headers X-User-* son internos; Gateway los inyecta y microservicios los leen
- Si falta header X-User-Role → rechazar con 401 (no asumir rol por defecto)
- Logs de autorizacion: registrar intentos fallidos con IP, ruta, rol intentado

## DevOps

- Pruebas unitarias para cada combinacion rol + endpoint
- Integracion continua: test de regresion RBAC en cada PR
- Documentacion viviente: esta matriz se genera desde los tests
- Auditoria semanal: revision de accesos anomales por rol

## Vulnerabilidades

| Vulnerabilidad | Mitigacion |
|---|---|
| Role spoofing via header manipulation | Gateway Kong remueve headers X-User-* entrantes antes de inyectar los propios |
| Missing authorization check | Template de ruta obliga a incluir `authorizeRole()` en toda ruta protegida |
| IDOR (acceso a recurso ajeno) | Validacion de propiedad en recursos sensibles (propio vs admin) |
| Rol por defecto inseguro | Sin header X-User-Role → 401, no default |
| Guest privilege escalation | Guest restrictions validadas en backend, no solo frontend |
