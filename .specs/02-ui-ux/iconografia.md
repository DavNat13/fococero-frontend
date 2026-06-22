# Iconografia

El sistema de iconos de FocoCero utiliza **lucide-react-native** como biblioteca principal de iconos. Se complementa con ilustraciones SVG personalizadas para estados vacios y representaciones graficas especificas del dominio de incendios.

## Estandares de tamano

| Contexto | Tamano | Componente |
|----------|--------|------------|
| Iconos en Tab Bar | 24px | `TabBarIcon` |
| Iconos en botones | 20px | `IconButton`, `Button` con icon |
| Iconos en cards | 24px | `ActionCard`, `StatCard` |
| Iconos en inputs | 20px | `Input` con `leftIcon` / `rightIcon` |
| Iconos en alertas | 24px | `AlertBanner`, `Toast` |
| Iconos decorativos | 32px | Empty states, ilustraciones |
| Ilustraciones SVG | 120-200px | `EmptyRadar`, `OfflineSatellite`, `CloudSyncSuccess` |

## Nomenclatura de iconos

Los iconos de lucide-react-native se importan por nombre PascalCase:

```tsx
import { Flame, MapPin, AlertTriangle, Bell, User, Settings, LogOut, ChevronRight, X, Search, Check, Upload, Wifi, WifiOff, Clock, RefreshCw, Navigation, Shield, CircleAlert, Mountain, Trees, Droplets, Wind, Thermometer, Eye, Camera, FileText, Menu, Home, LayoutDashboard, Users, Map as MapIcon } from 'lucide-react-native';
```

## Iconos por contexto

| Contexto | Icono primario | Alternativo |
|----------|---------------|-------------|
| Reportar incendio | `Flame` | `CircleAlert` |
| Ubicacion | `MapPin` | `Navigation` |
| Alertas | `Bell` | `AlertTriangle` |
| Perfil | `User` | `Shield` |
| Dashboard | `LayoutDashboard` | `Home` |
| Mapa | `MapIcon` | `Navigation` |
| Usuarios (admin) | `Users` | `User` |
| Configuracion | `Settings` | `Menu` |
| Cerrar sesion | `LogOut` | - |
| Offline | `WifiOff` | `Cloud` (con slash) |
| Sincronizar | `RefreshCw` | `Upload` |
| Exito | `Check` | `CheckCircle` |
| Error | `X` | `CircleAlert` |
| Camara | `Camera` | `Image` |
| Reportes | `FileText` | `ClipboardList` |

## Ilustraciones SVG

Tres ilustraciones personalizadas en `src/components/illustrations/`:

- **EmptyRadar**: Mapa de radar sin datos. Usado en pantalla de Mapa cuando no hay incidentes cercanos.
- **OfflineSatellite**: Satelite de comunicaciones desconectado. Usado en el banner de conectividad.
- **CloudSyncSuccess**: Nube con check de sincronizacion. Usado al confirmar envio de reporte offline.

Las ilustraciones se renderizan como componentes React Native SVG (`react-native-svg`). Son responsivas (fill="currentColor") y se adaptan al tema activo.

## Seguridad y Devops

- Los iconos no transportan informacion sensible
- Las ilustraciones SVG se inlinen en el bundle; no requieren peticiones de red
- El arbol de iconos se audita con `react-native-bundle-visualizer` para evitar bloat
- Solo se importan los iconos usados. lucide-react-native soporta tree-shaking nativo
- No se almacenan SVGs externos ni rutas de assets que puedan ser interceptadas

## Privacidad

- No se utilizan iconos personalizados que puedan hacer fingerprinting del dispositivo
- Las ilustraciones son genericas y no contienen datos de usuario
- Los iconos de estado offline/online no revelan patrones de conexion a terceros
