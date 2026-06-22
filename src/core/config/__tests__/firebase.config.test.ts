// src/core/config/__tests__/firebase.config.test.ts

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(() => 'mockPersistence'),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({}));

jest.mock('../env.config', () => ({
  getEnv: jest.fn(),
}));

import { getFirebaseApp, getFirebaseAuth, getGoogleClientId } from '../firebase.config';

describe('firebase.config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFirebaseApp', () => {
    it('inicializa Firebase App con la configuración del entorno', () => {
      const { getEnv } = require('../env.config');
      (getEnv as jest.Mock).mockReturnValue({
        EXPO_PUBLIC_FIREBASE_API_KEY: 'test-api-key',
        EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
        EXPO_PUBLIC_FIREBASE_PROJECT_ID: 'test-project',
        EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
        EXPO_PUBLIC_FIREBASE_APP_ID: '1:test:web:test',
      });

      const { initializeApp, getApps } = require('firebase/app');
      (getApps as jest.Mock).mockReturnValue([]);
      (initializeApp as jest.Mock).mockReturnValue({ name: '[DEFAULT]' });

      const app = getFirebaseApp();

      expect(initializeApp).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
        authDomain: 'test.firebaseapp.com',
        projectId: 'test-project',
        storageBucket: 'test.appspot.com',
        appId: '1:test:web:test',
      });
      expect(app).toBeDefined();
    });

    it('reusa la app existente si ya fue inicializada', () => {
      const { getEnv } = require('../env.config');
      (getEnv as jest.Mock).mockReturnValue({
        EXPO_PUBLIC_FIREBASE_API_KEY: 'test-api-key',
        EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
        EXPO_PUBLIC_FIREBASE_PROJECT_ID: 'test-project',
        EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
        EXPO_PUBLIC_FIREBASE_APP_ID: '1:test:web:test',
      });

      const { initializeApp, getApps } = require('firebase/app');
      (getApps as jest.Mock).mockReturnValue([{ name: '[DEFAULT]' }]);

      const app = getFirebaseApp();
      expect(initializeApp).not.toHaveBeenCalled();
    });
  });

  describe('getFirebaseAuth', () => {
    it('inicializa Firebase Auth con persistencia nativa', () => {
      const { initializeAuth } = require('firebase/auth');

      const auth = getFirebaseAuth();

      expect(initializeAuth).toHaveBeenCalledWith(expect.any(Object), {
        persistence: 'mockPersistence',
      });
    });
  });

  describe('getGoogleClientId', () => {
    it('retorna el client ID configurado', () => {
      const { getEnv } = require('../env.config');
      (getEnv as jest.Mock).mockReturnValue({
        EXPO_PUBLIC_FIREBASE_CLIENT_ID: 'test-client-id.apps.googleusercontent.com',
      });

      const clientId = getGoogleClientId();

      expect(clientId).toBe('test-client-id.apps.googleusercontent.com');
    });

    it('retorna undefined si no hay client ID', () => {
      const { getEnv } = require('../env.config');
      (getEnv as jest.Mock).mockReturnValue({
        EXPO_PUBLIC_FIREBASE_CLIENT_ID: undefined,
      });

      const clientId = getGoogleClientId();

      expect(clientId).toBeUndefined();
    });
  });
});
