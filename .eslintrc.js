// c:/Users/David/Desktop/FocoCero/fococero-frontend/.eslintrc.js

module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    'unicode-bom': ['error', 'never'],
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'dist/',
    'coverage/',
    'web-build/',
    'android/',
    'ios/',
  ],
};
