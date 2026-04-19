// c:/Users/David/Desktop/FocoCero/fococero-frontend/global.d.ts

/// <reference types="nativewind/types" />

// Declaración global absoluta para archivos CSS
declare module '*.css' {
  const content: any;
  export default content;
}
