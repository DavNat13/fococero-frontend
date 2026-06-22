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
    // Módulos core
    'src/core/api/**/*.{ts,tsx}',
    'src/core/config/**/*.{ts,tsx}',
    // Módulos features
    'src/features/auth/api/**/*.{ts,tsx}',
    'src/features/auth/hooks/**/*.{ts,tsx}',
    'src/features/auth/model/**/*.{ts,tsx}',
    'src/features/auth/utils/**/*.{ts,tsx}',
    'src/features/auth/offline-strategy/**/*.{ts,tsx}',
    'src/features/auth/ui/**/*.{ts,tsx}',
    // Módulos entities (stores)
    'src/entities/alerta/model/**/*.{ts,tsx}',
    'src/entities/analitica/model/**/*.{ts,tsx}',
    'src/entities/reporte/model/**/*.{ts,tsx}',
    // Módulos shared (core business logic)
    'src/shared/constants/**/*.{ts,tsx}',
    'src/shared/hooks/**/*.{ts,tsx}',
    'src/shared/ui/atoms/**/*.{ts,tsx}',
    'src/shared/ui/molecules/**/*.{ts,tsx}',
    'src/shared/ui/icons/*.tsx', // Solo archivos raíz, no subdirectorios
    'src/shared/ui/layouts/**/*.{ts,tsx}',
    'src/shared/utils/**/*.{ts,tsx}',
    // Módulos widgets (auth)
    'src/widgets/auth/**/*.{ts,tsx}',
    // Exclusiones
    '!src/**/*.styles.ts',
    '!src/**/index.ts',
    '!src/shared/types/**',
    '!src/shared/ui/animations/**', // Exclusión temporal por dependencia CSS-interop
    '!src/shared/ui/forms/**', // Exclusión temporal (wrapper components)
    '!src/shared/ui/illustrations/**', // Exclusión temporal (SVG art)
    '!src/shared/ui/icons/AnimatedIcon.tsx', // Exclusión temporal (CSS-interop issues)
    '!src/shared/ui/icons/StatusIcon.tsx', // Exclusión temporal (CSS-interop issues)
    '!src/shared/ui/molecules/ActionCard.tsx',
    '!src/shared/ui/molecules/ActivityItem.tsx',
    '!src/shared/ui/molecules/BottomSheet.tsx',
    '!src/shared/ui/molecules/ConfirmModal.tsx',
    '!src/shared/ui/molecules/InfoListItem.tsx',
    '!src/shared/ui/molecules/InputGroup.tsx',
    '!src/shared/ui/molecules/ModalDialog.tsx',
    '!src/shared/ui/molecules/SearchBar.tsx',
    '!src/shared/ui/molecules/SectionHeader.tsx',
    '!src/shared/ui/molecules/SettingItem.tsx',
    '!src/shared/ui/molecules/StepIndicator.tsx',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],

  // 5. Umbrales de Calidad (Falla el build si baja del umbral)
  coverageThreshold: {
    global: {
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
