// CONVENTIONS.md
# CONVENTIONS - FocoCero

## 1. Idioma
- **Código y Commits:** 100% Inglés (variables, funciones, ramas, PRs).
- **Documentación y UI:** 100% Español (archivos .md, textos en pantalla).

## 2. Reglas de TypeScript
- Prohibido absolutamente el uso de `any`. Todo DTO y respuesta de red debe validarse en tiempo de ejecución con `Zod`.
- Interface > Type (excepto para uniones o utilidades genéricas).

## 3. Flujo de Trabajo Frontend (Bottom-Up)
1. Definir Tipos y Esquemas (`entities/`).
2. Crear conexión API y estrategia Offline (`api/`, `offline/`).
3. Construir Store y Custom Hooks (`model/`, `hooks/`).
4. Ensamblar UI (`shared/`, `widgets/`).

## 4. Testing Obligatorio (TDD)
- No se acepta lógica de dominio sin su respectivo `.test.ts`. Cobertura mínima del 80%.

## 5. Prevención de Errores y Depuración
- **Kaizen (5 Porqués):** Ante un bug crítico, no se aplican parches (`try-catch` ciegos). Se rastrea la causa raíz (Root Cause Tracing) analizando la traza de red o el estado del store.
- **Logs:** Todo error asíncrono debe loguearse con un contexto estructurado, no con un simple `console.log(error)`.

## 6. Versionado (GitFlow)
- `main` (Producción), `develop` (Integración), `feature/[nombre]` (Desarrollo).
- **Conventional Commits:** `feat(auth): ...`, `fix(offline): ...`, `refactor(ui): ...`.