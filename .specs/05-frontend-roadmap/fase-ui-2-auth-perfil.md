# Fase UI-2: Auth + Perfil + Config (COMPLETADO)

## Resumen

Sistema de autenticacion, gestion de perfiles por rol y pantallas de configuracion. Integra Firebase Authentication como proveedor OAuth y JWT emitido por el microservicio Usuario.

## Flujo de Autenticacion

```
App Launch
  -> SecureStore: token existe?
    -> SI: valido con /api/usuario/verify
      -> OK: redirige a home segun rol
      -> 401: refresh token -> logout
    -> NO: WelcomeWidget
      -> LoginWidget o RegisterWidget (toggle en AuthFormWidget)
```

## WelcomeWidget

- Animacion de entrada con Reanimated 4 (FadeIn + SlideUp secuencial)
- Logo SVG animado (ilustracion TeamDispatch)
- Boton "Google Sign-In" con animacion de progreso
- Enlace "Acceso como invitado" debajo del fold
- Sin acceso a SecureStore hasta autenticacion exitosa

## AuthFormWidget

- **Toggle Login / Register**: Transicion animada con layout spring
- **Login**: email + password + "Olvidaste tu contrasena"
- **Register**: email + password + confirmar password + nombre completo + seleccion de rol
- **Validacion**: zod schemas con mensajes de error en tiempo real
- **Google Auth**: Expo GoogleSignIn -> Firebase credential -> JWT desde backend
- **Error handling**: Mapeo de codigos Firebase a mensajes en espanol
- **Seguridad**: Input tipo password con mascara, sanitizacion en cliente y servidor

## Perfil por Rol (3 layouts)

### Admin
- Dashboard de metricas (usuarios activos, alertas abiertas, despachos en curso)
- Lista de usuarios del sistema con busqueda y filtros
- Acceso a configuracion global del sistema
- Datos personales editables + cambio de password

### Brigadista
- Datos del equipo asignado y zona de operacion
- Estadisticas personales (alertas atendidas, horas de servicio)
- Certificaciones y estado de disponibilidad (disponible/en pausa/fuera de servicio)
- Historial de despachos recibidos

### Ciudadano
- Datos personales basicos
- Preferencias de notificacion por region y tipo de alerta
- Historial de reportes creados
- Zonas de interes guardadas (favoritos en mapa)

## Config Screen (Admin)

- Gestion de roles y permisos del sistema
- Configuracion de APIs externas (CONAF, Bomberos, ONEMI)
- Parametros de alerta (radio de notificacion, umbrales de severidad)
- Logs del sistema y monitoreo de salud de microservicios
- Backup y exportacion de datos

## GuestAccessWidget

- Acceso restringido sin autenticacion
- Permisos: solo lectura de mapa publico, visualizacion de alertas activas
- Sin acceso a reportar, crear alertas, ver perfiles
- Banner persistente: "Estas navegando como invitado"
- Boton "Iniciar sesion" en toda pantalla restringida

## Seguridad (JWT + SecureStore)

- Token almacenado en SecureStore con clave "fococero_jwt"
- Refresh token rotado cada 15 minutos via Axios interceptor
- Fingerprint del dispositivo enviado en header X-Device-Id
- Logout: limpieza de SecureStore + cache de React Query + reset de Zustand
- Bloqueo de sesion tras 5 intentos fallidos (rate limit en backend)

## Vulnerabilidades Mitigadas

| Vector | Proteccion |
|--------|------------|
| Token interception en transito | HTTPS + pinning SSL |
| Almacenamiento inseguro | SecureStore en lugar de AsyncStorage |
| Session hijacking | Refresh token rotation + device fingerprint |
| Brute force en login | Rate limiting + exponential backoff |
| XSS en formularios | Validacion zod + sanitizacion backend |

## DevOps

- Auth flow cubierto por tests E2E con Detox
- SecureStore mockeado en tests unitarios
- CI validacion de schema zod ante cambios en formularios
- Logging de eventos de autenticacion para auditoria
