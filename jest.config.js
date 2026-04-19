// jest.config.js
module.exports = {
  // 1. Preset oficial para entornos Expo
  preset: 'jest-expo',

  // 2. Configuración de transformación para librerías nativas
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|tailwind-merge)',
  ],

  // 3. Setup de matchers personalizados (como .toBeVisible() o .toHaveTextContent())
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  // 4. Configuración de Cobertura (Misión Crítica - Rúbrica)
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Analizar todo en src
    '!src/**/*.styles.ts', // EXCLUIR archivos de solo estilos
    '!src/**/index.ts', // EXCLUIR archivos barril
    '!src/shared/types/**', // EXCLUIR solo definiciones de tipos
    '!src/core/config/**', // EXCLUIR configuraciones estáticas
    '!**/node_modules/**',
    '!**/vendor/**',
  ],

  // 5. Umbrales de Calidad (Falla el build si baja del 60%)
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },

  // 6. Reportes amigables para el CI/CD
  coverageReporters: ['text', 'lcov', 'clover', 'json-summary'],

  moduleNameMapper: {
    // Sincronización con nuestros Path Aliases del tsconfig
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
