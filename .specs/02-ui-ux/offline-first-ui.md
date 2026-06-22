# Offline-first UI

La experiencia offline-first es fundamental para FocoCero. La aplicacion debe ser util en zonas sin cobertura, tipicas de areas de incendio forestal.

## Arquitectura de almacenamiento

```
L1 (Memoria) - Zustand store
  | Datos de sesion, UI state, cache de pantalla actual
  | Se pierde al cerrar app
L2 (Persistente) - AsyncStorage + SecureStore
  | SecureStore: JWT, refresh token, credenciales
  | AsyncStorage: Outbox, cache de datos, preferencias
```

## Indicador de conectividad

Un `AlertBanner` persistente en la parte superior de la pantalla muestra el estado actual:

- **Online**: Banner oculto. Icono `Wifi` verde en tab bar (opcional).
- **Offline**: Banner visible: "Sin conexion. Los cambios se guardaran localmente." Icono `WifiOff` rojo.
- **Reconnecting**: Banner con "Reconectando..." y spinner. Pasa a offline tras 10s sin exito.

## Optimistic updates

Cuando el usuario realiza una accion (reportar incendio, cambiar estado):

1. La UI muestra el cambio inmediatamente con estado `pending`
2. La operacion se persiste en la outbox (AsyncStorage)
3. El `SyncOrchestrator` procesa la outbox en orden FIFO
4. Al confirmar, el estado cambia a `confirmed`
5. Si falla, el estado cambia a `failed` con opcion de reintentar

```tsx
// Estado visual de una operacion offline
type SyncStatus = 'pending' | 'syncing' | 'confirmed' | 'failed';
```

## Outbox pattern

La outbox es una cola FIFO de operaciones pendientes:

```tsx
interface OutboxEntry {
  id: string;        // UUID v4 generado localmente
  type: string;      // 'reportar_incendio' | 'actualizar_perfil'
  payload: unknown;  // Datos de la operacion
  status: SyncStatus;
  createdAt: string; // ISO 8601
  retries: number;   // Maximo 3
  checksum: string;  // SHA-256 del payload para integridad
}
```

La outbox se persiste en AsyncStorage con cifrado AES-GCM del payload. Cada entrada incluye un checksum para detectar corruption de datos.

## SyncOrchestrator

```tsx
class SyncOrchestrator {
  async sync(): Promise<SyncResult> {
    const outbox = await this.loadOutbox();
    for (const entry of outbox) {
      if (!verifyChecksum(entry)) {
        await this.markFailed(entry.id);
        continue;
      }
      try {
        await this.api.send(entry.payload);
        await this.markConfirmed(entry.id);
      } catch (error) {
        if (entry.retries >= 3) await this.markFailed(entry.id);
        else await this.requeue(entry);
      }
    }
  }
}
```

## Visualizacion de la cola

- En pantalla de perfil, seccion "Operaciones pendientes" muestra el numero de items en outbox
- Cada operacion pendiente tiene icono `Clock` (pending), `RefreshCw` (syncing), `Check` (confirmed), `X` (failed)
- Las operaciones fallidas muestran boton "Reintentar"
- Pull-to-refresh en dashboard ejecuta sync manual

## Seguridad y privacidad

- La outbox se cifra en reposo con AES-GCM. La clave se deriva del JWT via PBKDF2
- Los checksums SHA-256 detectan corruption de datos en almacenamiento local
- Al cerrar sesion, la outbox completa se elimina con `SecureStore.deleteItemAsync` + `AsyncStorage.multiRemove`
- Los JWT expirados en la outbox se rechazan; se intenta refresh antes de sincronizar
- La cache L2 (AsyncStorage) no almacena datos PII no esenciales

## Clean Architecture

El `SyncOrchestrator` es un servicio de infraestructura inyectado via contexto. La UI solo conoce los estados `SyncStatus` y las acciones `sync()`, `retry(id)`, `clearOutbox()`. La implementacion del cifrado, la cola y la comunicacion con API esta completamente desacoplada de la capa de presentacion.

## Vulnerabilidades mitigadas

- **Replay attack**: Cada entry tiene un `id` UUID v4 unico que el servidor valida como nonce
- **Data corruption**: Checksum SHA-256 en cada entrada
- **Token expiry**: Refresh antes de sincronizar; si falla, la outbox no se procesa hasta nuevo login
- **Race condition**: La outbox se procesa secuencialmente (FIFO), no en paralelo
