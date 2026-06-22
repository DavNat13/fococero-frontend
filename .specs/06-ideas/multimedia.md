# Multimedia — ms-multimedia (puerto 3005)

## Descripcion General

Microservicio de gestion de archivos multimedia. Maneja upload, descarga y eliminacion de evidencias (fotos, videos) asociadas a reportes y alertas del sistema. Todo usuario autenticado puede subir archivos; la eliminacion esta restringida al creador o ADMIN.

## Endpoints

| Metodo | Endpoint | Auth | Descripcion |
|---|---|---|---|
| POST | /api/multimedia/upload | JWT (TODOS) | Subir archivo |
| GET | /api/multimedia/:id | JWT (TODOS) | Descargar archivo |
| DELETE | /api/multimedia/:id | CREADOR, ADMIN | Eliminar archivo |
| GET | /api/multimedia | JWT (TODOS) | Listar archivos propios |

## Flujo de Upload

```
POST /api/multimedia/upload
  Headers: Authorization: Bearer <jwt>, Content-Type: multipart/form-data
  Body: file (binary)
  
  → Valida JWT y extrae uid
  → Valida tipo MIME contra whitelist
  → Valida tamano contra limite por tipo
  → Genera UUID para el filename (previene path traversal)
  → Almacena metadata en PostgreSQL: id, filename, original_name, mime_type,
    size_bytes, bucket_path, created_by, created_at
  → Almacena archivo en S3-compatible (bucket: fococero-evidencias)
  → Retorna 201 con: { id, url_firma, mime_type, size_bytes }
```

### Formatos Soportados

| Tipo | MIME Types | Extensiones | Tamano Maximo |
|---|---|---|---|
| Imagen | image/jpeg, image/png, image/webp | .jpg, .jpeg, .png, .webp | 10 MB |
| Video | video/mp4 | .mp4 | 100 MB |

### Reglas Adicionales

- Videos mayores a 50 MB se procesan asincronamente (compresion con FFmpeg)
- Imagenes se redimensionan automaticamente a 1920px en lado mayor (mantiene aspect ratio)
- Thumbnail generado automaticamente (256x256) para imagenes

## Asociacion a Entidades

La vinculacion entre multimedia y entidades del sistema (reportes, alertas) se maneja en los respectivos microservicios:

- **Reportes**: campo `multimedia_ids` en payload de creacion/actualizacion
- **Alertas**: campo `evidencia_ids` en payload de verificacion
- No existe endpoint en ms-multimedia para asociar; es responsabilidad del microservicio cliente

## Seguridad y Privacidad

- **Acceso**: Cualquier usuario autenticado puede descargar cualquier archivo
- **Eliminacion**: Solo el creador del archivo o ADMIN puede eliminar
- **Path Traversal**: UUID como filename; nunca se usa el nombre original del usuario
- **MIME Spoofing**: Validacion por magic bytes (file signature) ademas de Content-Type
- **URL firmadas**: Las descargas usan URLs prefirmadas con TTL de 1 hora
- **Logs de acceso**: Cada descarga queda registrada: `{ multimedia_id, usuario_id, timestamp, ip }`

## DevOps

- Storage: S3-compatible (MinIO en desarrollo, AWS S3 en produccion)
- Bucket: `fococero-evidencias` con versioning habilitado
- Politica de retencion: 90 dias para archivos eliminados (soft delete en S3)
- Compresion de video via worker BullMQ con FFmpeg en contenedor separado
- CDN: CloudFront (o equivalente) para distribucion de descargas

## Vulnerabilidades

| Vulnerabilidad | Mitigacion |
|---|---|
| Subida de archivos maliciosos | Validacion por magic bytes + analisis ClamAV en worker asincrono |
| Path traversal | UUID como filename; bucket_path sanitizado |
| Denegacion por archivos gigantes | Limite por tipo + timeout de upload 30s + streaming |
| Exfiltracion por URL sharing | URL firmadas con TTL 1h + restriccion por IP de origen |
| Almacenamiento no autorizado | Logging de todas las subidas + alertas si supera 1GB/dia por usuario |
| Metadata manipulation | Validacion de propiedades (size, type) contra archivo real en servidor |
