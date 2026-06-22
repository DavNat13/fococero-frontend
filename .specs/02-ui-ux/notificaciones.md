# Notificaciones

El sistema de notificaciones utiliza **expo-notifications** para push notifications y manejo local. Esta disenado para entregar informacion critica incluso cuando la app esta en background o cerrada.

## Arquitectura

```
Servidor push (FCM/APNs)
       |
  expo-notifications
       |
  NotificationHandler (servicio central)
       |
  +----+----+
  |         |
Push     Local (offline queue,
local      sincronizacion,
toast      recordatorios)
```

## Canales de notificacion

| Canal | ID | Comportamiento | Rol destino |
|-------|----|----------------|-------------|
| Alertas generales | `alertas` | Sound + vibrate + banner | Ciudadano, Brigadista |
| Emergencias activas | `emergencias` | Critical alert (iOS), sound + vibrate + banner | Brigadista |
| Actualizacion mapa | `mapa` | Silent, solo badge | Brigadista |
| Sistema | `sistema` | Banner sin sound | Admin |
| Offline queue | `local_cola` | Local only, banner sin sound | Todos |

Los canales `alertas` y `emergencias` tienen prioridad alta (`importance: high` en Android, `critical: true` en iOS).

## Push notifications

El flujo de push es:

1. El servidor envia notificacion via FCM/APNs con payload estructurado
2. `expo-notifications` recibe y muestra segun el canal configurado
3. Al tocar la notificacion, se dispara deep link a la pantalla correspondiente
4. El estado de la notificacion se persiste localmente para referencia offline

Payload de push:

```json
{
  "title": "Nuevo incendio reportado",
  "body": "Sector Quebrada Verde - Prioridad alta",
  "data": {
    "type": "alerta",
    "alertaId": "abc-123",
    "deepLink": "fococero://alertas/abc-123",
    "timestamp": "2026-05-26T10:30:00Z"
  }
}
```

## Notificaciones locales

Usadas para:
- Confirmacion de reporte enviado (offline queue completada)
- Recordatorio de sincronizacion pendiente (outbox con datos > 5 min)
- Alerta de bateria baja durante seguimiento de ubicacion

## Manejo de estado de dispatch

El NotificationHandler orquesta la logica:

```tsx
// Pseudocodigo del handler
async function handleNotification(notification) {
  const { type, alertaId } = notification.data;
  switch (notification.triggerType) {
    case 'push':
      await dispatch(nuevasAlertasSlice.actions.add(alertaId));
      break;
    case 'local':
      await showToast(notification.body);
      break;
  }
}
```

## Seguridad y privacidad

- El token de push notification (Expo Push Token) se asocia al usuario en el servidor, pero se renueva cada vez que el JWT se refresca
- Las notificaciones no contienen datos de ubicacion exacta en el payload del banner
- Los deep links en notificaciones se validan contra XSS antes de navegar
- El canal `offline queue` solo notifica en local; no envia datos a servidores de terceros
- Las notificaciones se deshabilitan si el usuario cierra sesion, limpiando el token push en el servidor

## Devops

- Los tokens FCM/APNs se gestionan via Expo EAS Credentials, nunca en el codigo fuente
- El certificado de push se rota anualmente
- Las notificaciones fallidas se registran con contexto anonimizado para debugging
- Metricas de tasa de apertura de notificaciones se recolectan sin PII
