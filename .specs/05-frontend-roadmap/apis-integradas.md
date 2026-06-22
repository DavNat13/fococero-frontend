# APIs Integradas (COMPLETADO)

## Resumen

Las 7 APIs de microservicios estan completamente integradas con React Query (TanStack Query v5) para fetching/caching, Zustand para estado local sincrono y un patron de Facade hooks que unifica ambas capas. La arquitectura sigue FSD con separacion clara entre entidades, features y shared.

## Patron de Integracion: Facade Hook

Cada feature expone un unico hook facade que oculta la complejidad interna:

```
Componente (pages/)
  -> useAlertaFeature() (features/alertas)
    -> useAlertasQuery() (features/alertas/api) [React Query]
    -> useAlertaStore() (entities/alertas) [Zustand]
    -> metodos de negocio (create, update, delete)
```

### Facades Implementados

| Facade | Hooks React Query | Store Zustand | Metodos |
|--------|------------------|---------------|---------|
| useAlertaFeature | useAlertasList, useAlertaById, useAlertaCreate, useAlertaUpdate | alertaStore | create, updateStatus, assign, delete |
| useReporteFeature | useReportesList, useReporteById, useReporteCreate | reporteStore | create, verify, linkToAlerta, delete |
| useGeoFeature | useGeoLocation, useGeoHeatmap, useGeoSearch | geoStore | search, getRoute, getNearby |
| useEmergenciaFeature | useDespachosList, useDespachoById, useDespachoCreate, useDespachoTrack | despachoStore | create, updateStatus, cancel, track |
| useAnaliticaFeature | useKPIs, useTimeSeries, useHeatmapData | analiticaStore | getKPIs, getTrend, exportPDF, exportXLSX |
| useMultimediaFeature | useMultimediaList, useMultimediaUpload | multimediaStore | upload, delete, getGallery |
| useUsuarioFeature | useUsuarioProfile, useUsuarioUpdate | usuarioStore | updateProfile, changePassword, updatePreferences |

## Mapa de Rutas por Microservicio

### API Alertas (/api/alertas)
| Endpoint | Metodo | Hook React Query | Uso |
|----------|--------|------------------|-----|
| /alertas | GET | useAlertasList | Lista paginada con filtros |
| /alertas/:id | GET | useAlertaById | Detalle con timeline |
| /alertas | POST | useAlertaCreate | Crear alerta (Brig/Admin) |
| /alertas/:id | PATCH | useAlertaUpdate | Cambiar estado |
| /alertas/:id/assign | POST | useAlertaAssign | Asignar brigadista |

### API Reportes (/api/reportes)
| Endpoint | Metodo | Hook | Uso |
|----------|--------|------|-----|
| /reportes | GET | useReportesList | Lista con filtros |
| /reportes/:id | GET | useReporteById | Detalle |
| /reportes | POST | useReporteCreate | Crear reporte |
| /reportes/:id/verify | POST | useReporteVerify | Verificar (Admin) |

### API Geo (/api/geo)
| Endpoint | Metodo | Hook | Uso |
|----------|--------|------|-----|
| /geo/nearby | GET | useGeoNearby | Puntos cercanos |
| /geo/heatmap | GET | useGeoHeatmap | Datos de calor |
| /geo/search | GET | useGeoSearch | Busqueda de lugares |
| /geo/route | GET | useGeoRoute | Ruta entre puntos |

### API Emergencias (/api/emergencias)
| Endpoint | Metodo | Hook | Uso |
|----------|--------|------|-----|
| /emergencias/despachos | GET | useDespachosList | Lista de despachos |
| /emergencias/despachos/:id | GET | useDespachoById | Detalle + tracking |
| /emergencias/despachos | POST | useDespachoCreate | Crear despacho |
| /emergencias/despachos/:id | PATCH | useDespachoUpdate | Cambiar estado |

### API Analitica (/api/analitica)
| Endpoint | Metodo | Hook | Uso |
|----------|--------|------|-----|
| /analitica/kpis | GET | useKPIs | KPIs del dashboard |
| /analitica/trends | GET | useTimeSeries | Series temporales |
| /analitica/heatmap | GET | useAnaliticaHeatmap | Mapa de calor |
| /analitica/export/pdf | POST | useExportPDF | Generar PDF |
| /analitica/export/xlsx | POST | useExportXLSX | Generar Excel |

### API Multimedia (/api/multimedia)
| Endpoint | Metodo | Hook | Uso |
|----------|--------|------|-----|
| /multimedia | GET | useMultimediaList | Galeria paginada |
| /multimedia/upload | POST | useMultimediaUpload | Subir archivo |
| /multimedia/:id | DELETE | useMultimediaDelete | Eliminar archivo |

### API Usuario (/api/usuario)
| Endpoint | Metodo | Hook | Uso |
|----------|--------|------|-----|
| /usuario/profile | GET | useUsuarioProfile | Perfil actual |
| /usuario/profile | PATCH | useUsuarioUpdate | Actualizar perfil |
| /usuario/password | POST | usePasswordChange | Cambiar password |
| /usuario/preferences | PATCH | usePreferencesUpdate | Preferencias |

## Offline Queue Integration

- @tanstack/react-query-persist-client con AsyncStorage como persisted cache
- NetInfo para detectar conectividad y pausar/queries
- Cola de mutations offline: las peticiones se almacenan y ejecutan al恢复 conexion
- Optimistic updates para UI reactiva incluso sin conexion

## JWT Token Interceptor

- Axios instance centralizada en `shared/api/axios.ts`
- Request interceptor: inyecta token desde SecureStore en header Authorization
- Response interceptor: captura 401, intenta refresh token, fallback a logout
- Logout forzado si refresh falla (SecureStore cleanup + reset stores)
- Redaccion de token en logs de depuracion (seguridad)

## Configuracion React Query

| Parametro | Valor | Justificacion |
|-----------|-------|---------------|
| default staleTime | 5 min | Datos de emergencia no cambian constantemente |
| gcTime | 30 min | Cache para navegacion fluida entre pantallas |
| retry | 2 | Reintentos con backoff exponencial |
| refetchOnWindowFocus | true | Sincronizacion al volver a la app |
| refetchInterval | 30s (alertas activas) | Polling en datos de emergencia |
