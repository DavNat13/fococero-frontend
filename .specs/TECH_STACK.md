// .specs/context/TECH_STACK.md
# TECH STACK - FocoCero (Frontend)

## Core & UI
- **Framework:** React Native (0.74+) / Expo (SDK 51+). Compatible con Expo Go.
- **UI:** `@fococero/ui` (Librería propia) + NativeWind.
- **Mapas:** `react-native-maps` + `expo-location`.

## Estado & Datos
- **Estado Global:** Zustand (Stores segmentados por feature: Auth, Alertas, Geo).
- **Persistencia/Offline:** `react-native-mmkv` (Alta velocidad).
- **Cliente HTTP:** Axios con Interceptores inyectando Token de Firebase.

## Infraestructura & Seguridad
- **Auth Local:** Firebase Web SDK (`firebase/app` y `firebase/auth`). 
- **Validación:** Zod.
- **Gateway:** BFF Node.js desplegado en red local durante desarrollo (Sin `localhost`, usando IP).