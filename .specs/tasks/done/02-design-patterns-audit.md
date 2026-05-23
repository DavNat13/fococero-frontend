// .specs/tasks/draft/02-design-patterns-audit.md
# Spec: Auditoría y Documentación de Patrones de Diseño (Ev2)

## 1. Contexto y Objetivo
La rúbrica académica Ev2 FullStack exige la implementación, justificación y defensa de al menos 3 patrones de diseño en el frontend. El objetivo de este draft es auditar el código existente para confirmar que estos patrones se aplican con rigor académico y generar el documento de análisis requerido para la entrega.

## 2. Patrones Objetivo (Target Patterns)
1. **Singleton (Creacional):**
   - **Ubicación:** `src/core/api/api.client.ts` y `src/core/offline/storage.client.ts`.
   - **Misión:** Garantizar una única instancia del cliente HTTP y del motor de persistencia local. Previene colisiones de red y corrupción de datos en la cola offline.
2. **Observer / Pub-Sub (Comportamiento):**
   - **Ubicación:** `src/features/auth/model/auth.store.ts` y cualquier store de Zustand.
   - **Misión:** Desacoplar el estado global de la interfaz. Permite que múltiples componentes escuchen y reaccionen a eventos (como un cambio en `FocoIncendio`) sin recurrir al *prop-drilling*.
3. **Container / Presenter (Estructural):**
   - **Ubicación:** Interacción entre `src/widgets/` (Containers) y `src/shared/ui/` (Presenters).
   - **Misión:** El Widget orquesta los datos consumiendo los *Hooks* lógicos, mientras que el componente UI compartido es "tonto", puro y reactivo únicamente a las *props* que recibe.

## 3. Tareas de Ejecución (Action Items)
- **Refinamiento de Código:** El agente `@frontend-developer` debe inspeccionar los archivos mencionados y añadir comentarios estratégicos (JSDoc) explicando la presencia del patrón para facilitar la defensa oral.
- **Generación de Documento:** El agente `@software-architect` debe crear el borrador `Analisis_Patrones_Frontend.md` en la raíz de `.specs/reports/` con la justificación técnica que se transformará en el PDF final.