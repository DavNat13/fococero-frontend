# Navegacion

FocoCero utiliza **Expo Router** con file-based routing. La navegacion se organiza en grupos de archivos que representan dominios funcionales separados por rol de usuario.

## Estructura de grupos (Route groups)

```
app/
  _layout.tsx              // Root layout: providers, fonts, guards
  index.tsx                // Redireccion a /login o /(rol)/inicio segun sesion
  (auth)/
    _layout.tsx            // Layout sin tabs, solo header
    login.tsx
    register.tsx
    forgot-password.tsx
  (ciudadano)/
    _layout.tsx            // Tab bar ciudadano
    (tabs)/
      _layout.tsx          // Config tabs
      inicio.tsx
      reportar.tsx
      alertas.tsx
      perfil.tsx
  (brigadista)/
    _layout.tsx            // Tab bar brigadista
    (tabs)/
      _layout.tsx
      dashboard.tsx
      mapa.tsx
      reportes.tsx
      emergencias.tsx
      perfil.tsx
  (admin)/
    _layout.tsx            // Tab bar admin
    (tabs)/
      _layout.tsx
      dashboard.tsx
      mapa.tsx
      usuarios.tsx
      config.tsx
      perfil.tsx
```

## Auth guards

El root layout ejecuta un auth guard en cada transicion de ruta:

1. Verifica existencia de JWT en SecureStore
2. Decodifica el token (sin verificar firma en cliente, solo para extraer rol y exp)
3. Valida que el rol corresponda al grupo destino
4. Si el token expiro, intenta refresh con el refresh token
5. Si el refresh falla, redirige a `/(auth)/login` y limpia SecureStore

```tsx
// Pseudocodigo del guard
const { token, rol } = await getAuthState();
if (!token || isExpired(token)) {
  const refreshed = await refreshToken();
  if (!refreshed) return redirect('/login');
}
if (!hasPermission(rol, routeGroup)) return redirect(`/(${rol})/inicio`);
```

## Tab Bar

La tab bar tiene altura fija de 80px (incluyendo safe area bottom). Usa `lucide-react-native` con tamano 24px. Muestra badge numerico en el icono de alertas cuando hay notificaciones no leidas.

Cada grupo define su propio `_layout.tsx` con la configuracion de tabs especifica de su rol.

## Deep linking

Soportado via `expo-linking` para:
- `fococero://alertas/{id}`: Abre detalle de alerta
- `fococero://emergencias/{id}`: Abre detalle de emergencia activa (solo brigadista)
- `fococero://reportar`: Abre pantalla de reporte de incendio

Deep links verifican el JWT antes de navegar. Si el token no es valido, redirigen a login manteniendo la URL como `redirect` post-autenticacion.

## Modal presentations

Pantallas modales declaradas con `presentation: "modal"` en el layout:
- `BottomSheet` para seleccion de opciones
- `ModalDialog` para confirmaciones destructivas
- Pantalla de detalle de alerta (stack modal sobre tabs)

## Seguridad

- Los deep links no transportan JWT ni tokens sensibles en la URL
- El guard de autenticacion ejecuta validacion sincrona de expiracion antes de renderizar cualquier pantalla
- El refresh token se almacena en SecureStore con acceso biometrico opcional
- La revocacion de sesion (logout) limpia SecureStore y AsyncStorage completamente, incluyendo cache offline
- Las rutas no existentes redirigen a `/(auth)/login` sin revelar estructura interna

## Clean Architecture

La navegacion es orquestada por el router. Las pantallas no navegan directamente a rutas de otros roles. Solo el guard central tiene conocimiento de la estructura completa de rutas. Cada pantalla solo conoce las rutas dentro de su propio grupo.
