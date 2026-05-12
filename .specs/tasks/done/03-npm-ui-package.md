# Spec: Empaquetado NPM de Componentes Frontend (Ev2)

## 1. Contexto y Objetivo

La rúbrica exige la entrega de "componentes frontend de tipo NPM". Para cumplir esto de forma elegante en nuestra arquitectura FSD, aislaremos el sistema de diseño (`src/shared/ui`) configurándolo como un paquete NPM local (`@fococero/ui`). Esto demuestra modularidad avanzada y preparación para un futuro monorepo.

## 2. Tareas de Ejecución (Action Items)

El agente `@frontend-developer` debe realizar las siguientes acciones:

1. **Creación del Manifiesto NPM:**
   - Crear un archivo `src/shared/ui/package.json`.
   - Definir el nombre del paquete: `"name": "@fococero/ui"`.
   - Definir la versión inicial: `"version": "1.0.0"`.
   - Configurar `"main": "index.ts"`.
   - Establecer `"peerDependencies"` obligando a quien instale el paquete a proveer `react` y `react-native`.

2. **Punto de Entrada (Indexación):**
   - Verificar o crear `src/shared/ui/index.ts`.
   - Asegurar que este archivo exporte explícitamente todos los componentes base (ej. Button, Input, Modal, Tipografía) de las subcarpetas `atoms`, `molecules` y `layouts`.

3. **Documentación del Paquete:**
   - Crear un `src/shared/ui/README.md`.
   - Este README debe explicar cómo instalar (en un entorno simulado) y cómo consumir los componentes (ej. `import { Button } from '@fococero/ui'`), cumpliendo con el rigor documental de una librería Open Source.

## 3. Criterios de Aceptación

- La aplicación Expo debe seguir compilando sin errores (Metro resolverá localmente).
- El archivo `package.json` de la UI no debe chocar con las dependencias globales del proyecto principal.
