// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Escaneo exhaustivo siguiendo la arquitectura FSD
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // 2. Tokens de diseño para FocoCero (Valle del Sol)
      colors: {
        primary: {
          DEFAULT: '#D9480F', // Naranja Incendio
          light: '#F76707',
          dark: '#AD390B',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#2B8A3E', // Verde Prevención
          light: '#40C057',
          dark: '#1B6B2E',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#E03131', // Rojo Alerta Crítica
          foreground: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8F9FA',
          border: '#E9ECEF',
        },
        brand: {
          municipalidad: '#1A1B1E', // Color institucional
        },
      },
      fontFamily: {
        mono: ['SpaceMono'],
      },
      spacing: {
        'safe-top': 'var(--safe-area-inset-top)',
        'safe-bottom': 'var(--safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
