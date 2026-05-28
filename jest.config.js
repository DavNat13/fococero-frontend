// jest.config.js
module.exports = {
  // 1. Preset oficial para entornos Expo
  preset: 'jest-expo',

  // 2. Configuración de transformación para librerías nativas
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|tailwind-merge)',
  ],

  // 3. Setup de variables de entorno + matchers personalizados
  setupFiles: ['./jest.setup.js'],
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

  // 5. Umbrales de Calidad (Falla el build si baja del umbral)
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
    'src/shared/utils/**': {
      statements: 80,
      branches: 60,
      functions: 70,
      lines: 80,
    },
  },

  // 6. Reportes amigables para el CI/CD
  coverageReporters: ['text', 'lcov', 'clover', 'json-summary'],

  moduleNameMapper: {
    // Sincronización con nuestros Path Aliases del tsconfig
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@widgets/(.*)$': '<rootDir>/src/widgets/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
  },
};
