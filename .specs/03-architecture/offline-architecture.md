# Arquitectura Offline-First

## Proposito

Garantizar que FocoCero funcione sin conectividad constante, permitiendo a brigadistas y ciudadanos reportar incidentes, consultar datos y recibir alertas incluso en zonas sin cobertura movil.

## Estrategia General

```
[App React Native]
    |
    +-- Online: peticiones HTTP directas via Axios -> Gateway -> MS
    |
    +-- Offline: cola de operaciones en Outbox -> sincronizacion cuando haya conexion
    |
    +-- Cache: L1 (RAM) + L2 (AsyncStorage) para datos leidos frecuentemente
```

## Almacenamiento por Particiones

| Particion | Tecnologia | Contenido |
|---|---|---|
| **global** | AsyncStorage | Datos de cache L2: reportes vistos, mapa offline, alertas leidas |
| **secure** | SecureStore | JWT de Firebase, refresh token, datos de sesion |
| **outbox** | AsyncStorage + MMKV | Operaciones pendientes de sincronizar |

## Cache L1 (RAM) y L2 (AsyncStorage)

### Flujo de Lectura

```
Solicitud de datos
    |
    v
Cache L1 (Zustand store en RAM) -> hit? -> devolver
    |
    miss?
    v
Cache L2 (AsyncStorage) -> hit? -> poblar L1, devolver
    |
    miss?
    v
Peticion HTTP -> exito? -> poblar L1 + L2, devolver
    |
    error de red?
    v
Devolver error con indicacion offline
```

### Configuracion

```javascript
const cacheL2 = {
  ttl: {
    'reportes': 30 * 60 * 1000,      // 30 min
    'alertas': 5 * 60 * 1000,         // 5 min
    'zonas-riesgo': 24 * 60 * 60 * 1000, // 24h
    'perfil-usuario': 60 * 60 * 1000, // 1h
  },
  maxEntries: 1000,
  version: 1, // Incrementar para invalidar todo el cache en releases
};
```

## Outbox Pattern

### Estructura de Operacion en Outbox

```json
{
  "id": "out_<uuid>",
  "type": "CREATE_REPORTE",
  "payload": { "ubicacion": { "lat": -33.45, "lng": -70.65 }, "descripcion": "Humo visible" },
  "idempotencyKey": "rep_<uuid>",
  "status": "PENDING",
  "createdAt": "2026-05-26T10:30:00Z",
  "retryCount": 0,
  "maxRetries": 5
}
```

### Sync Orchestrator

```javascript
class SyncOrchestrator {
  constructor() {
    this.netInfo = NetInfo.addEventListener(this._onNetworkChange);
    this.isSyncing = false;
  }

  async _onNetworkChange(state) {
    if (state.isConnected && !this.isSyncing) {
      await this.syncOutbox();
    }
  }

  async syncOutbox() {
    this.isSyncing = true;
    const pending = await outbox.getPending();

    for (const operation of pending) {
      try {
        const response = await apiClient.post(operation.endpoint, operation.payload, {
          headers: { 'Idempotency-Key': operation.idempotencyKey },
        });
        await outbox.markCompleted(operation.id);
      } catch (error) {
        if (error.response?.status >= 400 && error.response?.status < 500) {
          await outbox.markFailed(operation.id, error.message); // No retry para 4xx
        } else {
          await outbox.incrementRetry(operation.id);
          if (operation.retryCount >= operation.maxRetries) {
            await outbox.markFailed(operation.id, 'Max retries exceeded');
          }
        }
      }
    }
    this.isSyncing = false;
  }
}
```

## Idempotency Keys

Cada operacion de escritura (crear reporte, enviar alerta) incluye un header `Idempotency-Key` en el request HTTP. El servidor (API Gateway o microservicio) almacena el resultado de la operacion por 24h.

Si el Sync Orchestrator reenvia una operacion (por timeout o error de red), el servidor detecta la key duplicada y devuelve el resultado previo, evitando duplicados.

```javascript
// Middleware de idempotencia en Gateway
const idempotencyMiddleware = async (req, res, next) => {
  const key = req.headers['idempotency-key'];
  if (!key) return next();

  const cached = await redis.get(`idempotency:${key}`);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  res.on('finish', async () => {
    if (res.statusCode < 500) {
      await redis.setex(`idempotency:${key}`, 86400, JSON.stringify(res.body));
    }
  });

  next();
};
```

## Conflicto de Resolucion

Cuando un dato creado offline entra en conflicto con datos del servidor:

- **Last Write Wins (LWW)**: El servidor usa el timestamp del `createdAt` del outbox para determinar cual version prevalece.
- **Conflict notification**: Si hay conflicto, el servidor devuelve un warning en la respuesta que la UI muestra al usuario.
- **Merge manual**: Para datos complejos (ej: perfil de usuario), se notifica al usuario para que resuelva.

## Seguridad Offline

- El JWT de Firebase se cachea en SecureStore para autenticar operaciones offline.
- Si el token expira mientras el dispositivo esta offline, las operaciones se encolan pero no se envian hasta obtener un nuevo token.
- El refresh token de Firebase permite renovar el JWT sin intervencion del usuario al recuperar conexion.

## Vulnerabilidades Offline

- **Data staleness**: Cache L2 con datos viejos. Mitigacion: TTL configurado por tipo de dato + indicador visual de "datos sin conexion".
- **Outbox overflow**: Muchas operaciones pendientes sin sincronizar. Mitigacion: limite de 1000 operaciones en outbox, alerta al usuario al superar 100.
- **Sync race conditions**: Dos operaciones offline que modifican el mismo recurso. Mitigacion: idempotency key + server-side conflict resolution.
- **Secure storage**: Los JWT en SecureStore se borran si la app se desinstala o si falla la biometria en 5 intentos.
