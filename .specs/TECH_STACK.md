// .specs/TECH_STACK.md
# TECH STACK - FocoCero (Frontend)

## Core & Framework
- **Framework:** React Native (0.74+) / Expo (SDK 51+). Compatible con Expo Go.
- **Lenguaje:** TypeScript (strict mode)
- **Navegación:** Expo Router (file-based routing)

## UI & Estilos
- **Estilos:** NativeWind (Tailwind CSS para React Native)
- **Componentes UI:** Librería propia en `src/shared/ui/`
- **Tipografía:** Inter (regular, bold) + Roboto (medium)
- **Iconos:** @expo/vector-icons (MaterialCommunityIcons)

## Mapas & Geolocalización
- **Mapas:** `react-native-maps` - Mapa interactivo con soporte 3D y satelite
- **Ubicación:** `expo-location` - GPS y tracking en tiempo real
- **Búsqueda:** Integración con APIs de geocodificación

## Estado & Datos
- **Estado Global:** Zustand (Stores segmentados por feature: Auth, Alertas, Geo, Reportes, etc.)
- **Estado Servidor:** TanStack Query (React Query) para cache y sincronización
- **Persistencia/Offline:** `react-native-mmkv` (Alta velocidad) + AsyncStorage
- **Cliente HTTP:** Axios con Interceptores inyectando Token de Firebase

## Gráficos & Visualización
- **Gráficos:** `react-native-gifted-charts` - Gráficos nativos de alto rendimiento
- **Dashboard:** Componentes personalizados con KPIs visuales

## Exportación
- **PDF:** `expo-print` + `expo-sharing` - Generación de reportes PDF
- **Excel:** `react-native-xlsx` - Hojas de cálculo Excel

## Notificaciones
- **Push:** `expo-notifications` - Notificaciones push locales y remotas
- **Canales:** Alertas por región, estados de despachos,recordatorios

## Animaciones
- **Core:** `react-native-reanimated` - Animaciones de alto rendimiento
- **Layout:** `react-native-gesture-handler` - Gestos táctiles

## Infraestructura & Seguridad
- **Auth Local:** Firebase Web SDK (`firebase/app` y `firebase/auth`)
- **Validación:** Zod (validación de schemas)
- **Gateway:** BFF Node.js desplegado en red local (Sin `localhost`, usando IP)

## Testing
- **Unitarios:** Jest
- **Componentes:** React Native Testing Library
- **E2E:** Detox (opcional)

---

## LIBRERÍAS INSTALADAS

| Categoría | Librería | Versión | Estado |
|-----------|----------|---------|--------|
| Framework | expo | SDK 51 | ✅ |
| Navegación | expo-router | latest | ✅ |
| Mapas | react-native-maps | latest | ⏳ Por instalar |
| Ubicación | expo-location | latest | ⏳ Por instalar |
| Estado | zustand | latest | ✅ |
| Query | @tanstack/react-query | 5.x | ✅ |
| HTTP | axios | latest | ✅ |
| Estilos | nativewind | latest | ✅ |
| Animaciones | react-native-reanimated | latest | ✅ |
| Gráficos | react-native-gifted-charts | latest | ⏳ Por instalar |
| PDF | expo-print | latest | ⏳ Por instalar |
| Excel | react-native-xlsx | latest | ⏳ Por instalar |
| Notificaciones | expo-notifications | latest | ⏳ Por instalar |
| Firebase | @react-native-google-signin/google-signin | latest | ✅ |

---

## ESTRUCTURA DE DEPENDENCIAS

```
package.json
├── expo (core)
├── expo-router (navegación)
├── react-native (runtime)
├── nativewind + tailwindcss (estilos)
├── zustand (estado global)
├── @tanstack/react-query (estado servidor)
├── axios (HTTP client)
├── react-native-reanimated (animaciones)
├── react-native-maps (mapas) ← pendiente
├── expo-location (GPS) ← pendiente
├── react-native-gifted-charts (gráficos) ← pendiente
├── expo-print + expo-sharing (PDF) ← pendiente
├── react-native-xlsx (Excel) ← pendiente
└── expo-notifications (push) ← pendiente
```

---

## CONFIGURACIÓN DE DESARROLLO

### Variables de Entorno Requeridas
```
EXPO_PUBLIC_API_GATEWAY_URL=http://192.168.1.142:3000
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
```

### Scripts Disponibles
- `npm start` - Iniciar Expo
- `npm run type-check` - Verificar TypeScript
- `npm run lint` - Verificar código
- `npm run build` - Build de producción