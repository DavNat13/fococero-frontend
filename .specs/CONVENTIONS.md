// CONVENTIONS.md
# CONVENTIONS - FocoCero

## 1. Idioma
- **Código y Commits:** 100% Inglés (variables, funciones, ramas, PRs).
- **Documentación y UI:** 100% Español (archivos .md, textos en pantalla).

## 2. Reglas de TypeScript
- Prohibido absolutamente el uso de `any`. Todo DTO y respuesta de red debe validarse en tiempo de ejecución con `Zod`.
- Interface > Type (excepto para uniones o utilidades genéricas).
-strict mode habilitado en tsconfig.json.

## 3. Flujo de Trabajo Frontend (Bottom-Up)
1. Definir Tipos y Esquemas (`entities/`).
2. Crear conexión API y estrategia Offline (`api/`, `offline/`).
3. Construir Store y Custom Hooks (`model/`, `hooks/`).
4. Ensamblar UI (`shared/`, `widgets/`).
5. Crear pantallas en (`app/`).

## 4. Convenciones de Componentes UI

### Naming
- **Componentes:** PascalCase (e.g., `Button`, `AlertCard`)
- **Funciones de componentes:** camelCase (e.g., `renderButton()`)
- **Props:** camelCase (e.g., `onPress`, `isLoading`)

### Estructura de Archivos
```
components/
├── atoms/           # Elementos básicos (Button, Input, Text)
├── molecules/       # Composición simple (Card, Badge, Modal)
├── organisms/       # Composición compleja (Form, List)
└── templates/       # Plantillas de pantalla
```

### Dimensiones Estándar
- **Botones:** minHeight: 48px, paddingHorizontal: 16px, borderRadius: 12px
- **Inputs:** minHeight: 48px, borderRadius: 12px, padding: 12px
- **Cards:** borderRadius: 16px, padding: 16px, shadow
- **Iconos:** size: 24px (estándar), 20px (pequeño), 32px (grande)
- **Espaciado:** múltiplos de 4px (4, 8, 12, 16, 24, 32, 48, 64)

### Colores (CSS Variables)
- **Brand Primary:** #EA580C (naranja fuego)
- **Brand Secondary:** #57534E (stone)
- **Brand Accent:** #DC2626 (rojo emergencia)
- **Success:** #059669 (verde)
- **Warning:** #D97706 (ámbar)
- **Danger:** #DC2626 (rojo)

### Estados de Componentes
- **Default:** color normal
- **Pressed:** opacity: 0.8, scale: 0.98
- **Disabled:** opacity: 0.5, cursor: not-allowed
- **Loading:** spinner o skeleton

## 5. Convenciones de Navegación

### Estructura de Rutas
- **(auth)/** - Rutas públicas (login, register)
- **(ciudadano)/** - Rol ciudadano
- **(brigadista)/** - Rol brigadista
- **(admin)/** - Rol administrador

### Naming de Pantallas
- `index.tsx` - Pantalla principal del grupo
- `[id].tsx` - Detalle de entidad
- `crear-[entidad].tsx` - Formulario de creación
- `editar-[entidad].tsx` - Formulario de edición
- `config.tsx` - Configuración

## 6. Convenciones de State Management

### Zustand Stores
- Nombre: `use[Nombre]Store` (e.g., `useAuthStore`, `useAlertaStore`)
- Ubicación: `entities/[nombre]/model/store.ts`
- Estado inicial en objeto separado

### React Query
- Keys: `['recurso', 'operacion', ...params]`
- Mutations con invalidación de queries relacionadas

## 7. Convenciones de API

### Endpoints
- Prefijo: `/api/[microservicio]/...`
- Métodos: GET (obtener), POST (crear), PATCH (actualizar parcial), PUT (actualizar completo), DELETE (eliminar)

### Responses
- Usar patrón Result: `{ success: boolean, data?: T, error?: Error }`

## 8. Testing Obligatorio (TDD)
- No se acepta lógica de dominio sin su respectivo `.test.ts`.
- Cobertura mínima del 80%.

## 9. Prevención de Errores y Depuración
- **Kaizen (5 Porqués):** Ante un bug crítico, no se aplican parches (`try-catch` ciegos). Se rastrea la causa raíz.
- **Logs:** Todo error asíncrono debe loguearse con contexto estructurado.

## 10. Versionado (GitFlow)
- `main` (Producción), `develop` (Integración), `feature/[nombre]` (Desarrollo).
- **Conventional Commits:** `feat(auth): ...`, `fix(offline): ...`, `refactor(ui): ...`.

## 11. Animaciones
- Duración estándar: 300ms
- Curva: ease-out para entradas, ease-in para salidas
- Usar react-native-reanimated para animaciones de rendimiento
- Skeleton loaders durante carga de datos
- Pull-to-refresh con indicador de carga

## 12. Accesibilidad
- Contraste mínimo WCAG AA (4.5:1 para texto normal)
- Elementos táctiles mínimos 44x44px
- Soporte para lectores de pantalla
- Labels en todos los inputs