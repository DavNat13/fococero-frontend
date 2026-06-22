describe('getEnv (configuración de entorno)', () => {
  let getEnv: typeof import('../env.config').getEnv;
  const OLD_ENV = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    // Restaurar env antes de cada test
    process.env = { ...OLD_ENV };
    // Garantizar setup mínimo
    process.env.EXPO_PUBLIC_API_GATEWAY_URL = 'http://localhost:3000';
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-key';
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID = '1:test:web:id';
    process.env.EXPO_PUBLIC_ENVIRONMENT = 'development';

    const envModule = require('../env.config');
    getEnv = envModule.getEnv;
  });

  afterAll(() => {
    process.env = { ...OLD_ENV };
  });

  it('retorna valores correctos cuando todas las variables existen', () => {
    const env = getEnv();
    expect(env.EXPO_PUBLIC_API_GATEWAY_URL).toBe('http://localhost:3000');
    expect(env.EXPO_PUBLIC_FIREBASE_API_KEY).toBe('test-key');
    expect(env.EXPO_PUBLIC_ENVIRONMENT).toBe('development');
  });

  it('aplica valores por defecto para campos opcionales', () => {
    const env = getEnv();
    expect(env.EXPO_PUBLIC_API_TIMEOUT).toBe(30000);
    expect(env.EXPO_PUBLIC_OFFLINE_SYNC_INTERVAL).toBe(30000);
    expect(env.EXPO_PUBLIC_LOG_LEVEL).toBe('debug');
  });

  it('usa caché después de la primera llamada', () => {
    const env1 = getEnv();
    const env2 = getEnv();
    expect(env1).toBe(env2);
  });

  it('acepta EXPO_PUBLIC_FIREBASE_CLIENT_ID como opcional', () => {
    process.env.EXPO_PUBLIC_FIREBASE_CLIENT_ID = 'client-id-123';
    jest.resetModules();
    const { getEnv: getEnv2 } = require('../env.config');
    const env = getEnv2();
    expect(env.EXPO_PUBLIC_FIREBASE_CLIENT_ID).toBe('client-id-123');
  });

  it('no lanza error cuando faltan variables requeridas', () => {
    delete (process.env as any).EXPO_PUBLIC_API_GATEWAY_URL;
    delete (process.env as any).EXPO_PUBLIC_FIREBASE_API_KEY;
    delete (process.env as any).EXPO_PUBLIC_ENVIRONMENT;
    jest.resetModules();
    const { getEnv: getEnv2 } = require('../env.config');
    const env = getEnv2();
    expect(env).toBeDefined();
  });
});

describe('ENV Proxy', () => {
  const OLD_ENV = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...OLD_ENV,
      EXPO_PUBLIC_API_GATEWAY_URL: 'http://localhost:3000',
      EXPO_PUBLIC_FIREBASE_API_KEY: 'key',
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: 'dom',
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: 'pid',
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: 'buk',
      EXPO_PUBLIC_FIREBASE_APP_ID: 'aid',
      EXPO_PUBLIC_ENVIRONMENT: 'development',
    };
  });

  afterAll(() => {
    process.env = { ...OLD_ENV };
  });

  it('accede a propiedades a través del Proxy', () => {
    const { ENV: ENVProxy } = require('../env.config');
    expect(ENVProxy.EXPO_PUBLIC_API_GATEWAY_URL).toBe('http://localhost:3000');
    expect(ENVProxy.EXPO_PUBLIC_ENVIRONMENT).toBe('development');
  });

  it('retorna undefined para propiedades inexistentes', () => {
    const { ENV: ENVProxy } = require('../env.config');
    expect((ENVProxy as any).PROP_NO_EXISTE).toBeUndefined();
  });
});
