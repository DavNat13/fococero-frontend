// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'rgb(var(--brand-primary) / <alpha-value>)',
          secondary: 'rgb(var(--brand-secondary) / <alpha-value>)',
          accent: 'rgb(var(--brand-accent) / <alpha-value>)',
        },
        surface: {
          background: 'rgb(var(--surface-background) / <alpha-value>)',
          card: 'rgb(var(--surface-card) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
        },
        content: {
          primary: 'rgb(var(--content-primary) / <alpha-value>)',
          secondary: 'rgb(var(--content-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--content-tertiary) / <alpha-value>)',
        },
        feedback: {
          danger: 'rgb(var(--feedback-danger) / <alpha-value>)',
          warning: 'rgb(var(--feedback-warning) / <alpha-value>)',
          success: 'rgb(var(--feedback-success) / <alpha-value>)',
        },
      },
      fontFamily: {
        inter: ['Inter_400Regular', 'Inter_700Bold'],
        roboto: ['Roboto_400Regular', 'Roboto_500Medium'],
      },
      boxShadow: {
        fuego: '0 4px 8px rgba(234, 88, 12, 0.3)',
      },
    },
  },
  plugins: [],
};
