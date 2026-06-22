# Autenticacion y Autorizacion (JWT)

## Flujo Completo de Autenticacion

```
[Frontend React Native]
    |
    | 1. Firebase Auth SDK: signInWithEmailAndPassword()
    |    Firebase emite ID Token (JWT, RFC 7519)
    |
    v
[SecureStore] <- Almacena el JWT de forma segura (no AsyncStorage)
    |
    | 2. Cada request: Axios interceptor agrega "Authorization: Bearer <JWT>"
    |
    v
[API Gateway]
    | 3. admin.auth().verifyIdToken(token)
    |    - Verifica firma (RS256) contra Firebase public keys
    |    - Verifica exp, aud, iss
    |    - Devuelve DecodedToken: { uid, email, firebase.claims.role }
    |
    | 4. Gateway inyecta en req.user = { uid, email, role }
    |
    | 5. Middleware RBAC: authorizeRole('BRIGADISTA', 'ADMIN')
    |
    | 6. Gateway genera JWT interno (x-internal-token) con HMAC-SHA256
    |    Claims: { sub: uid, role, iat: now, exp: now + 60s }
    |
    | 7. Proxy reenvia request + x-internal-token al microservicio
    |
    v
[Microservicio]
    | 8. Middleware valida x-internal-token con INTERNAL_TOKEN_SECRET
    | 9. Si es valido, procesa la request
    | 10. Si no, responde 401
```

## Firebase Auth

### Emision de Tokens

Firebase Auth emite ID Tokens (JWT) con las siguientes caracteristicas:

- **Algoritmo**: RS256 (RSA con SHA-256).
- **Claims**: `sub` (UID), `aud` (Firebase project ID), `iat`, `exp` (1 hora), `email`, `email_verified`.
- **Custom Claims**: `role` (`INVITADO`, `USUARIO`, `BRIGADISTA`, `ADMIN`) seteado via Firebase Admin SDK.

```javascript
// Seteo de custom claims (solo ADMIN puede ejecutar)
await admin.auth().setCustomUserClaims(uid, { role: 'BRIGADISTA' });
```

### Verificacion en Gateway

```javascript
const FirebaseAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'USUARIO',
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token invalido o expirado' });
  }
};
```

## Token Interno (x-internal-token)

### Generacion en Gateway

```javascript
const generateInternalToken = (user) => {
  return jwt.sign(
    {
      sub: user.uid,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60, // 1 minuto
    },
    process.env.INTERNAL_TOKEN_SECRET,
    { algorithm: 'HS256' }
  );
};
```

### Validacion en Microservicio

```javascript
const InternalAuthMiddleware = (req, res, next) => {
  const token = req.headers['x-internal-token'];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token interno requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.INTERNAL_TOKEN_SECRET, {
      algorithms: ['HS256'],
    });
    req.user = { uid: decoded.sub, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token interno invalido' });
  }
};
```

## RBAC (Role-Based Access Control)

### Middleware de Autorizacion

```javascript
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para acceder a este recurso',
      });
    }
    next();
  };
};

// Uso en rutas del Gateway
router.post('/emergencias', FirebaseAuthMiddleware, authorizeRole('ADMIN'), proxy);
router.post('/reportes', FirebaseAuthMiddleware, authorizeRole('USUARIO'), proxy);
router.get('/geo/map', FirebaseAuthMiddleware, authorizeRole('USUARIO', 'BRIGADISTA'), proxy);
```

## Almacenamiento Seguro en Cliente

- **SecureStore**: El JWT de Firebase se almacena en `expo-secure-store` (iOS Keychain / Android EncryptedSharedPreferences).
- **No se almacena en AsyncStorage**: AsyncStorage no es seguro para tokens.
- **Interceptor de Axios**: Lee el token desde SecureStore y lo inyecta en cada request.

```javascript
// Axios interceptor
axios.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Vulnerabilidades Mitigadas

- **Token theft**: El almacenamiento en SecureStore evita que otras apps accedan al token.
- **Token replay**: El token interno tiene TTL de 1 minuto para limitar ventana de reuso.
- **Broken Authentication**: Firebase Admin SDK maneja la verificacion criptografica. No hay implementacion manual de JWT verification.
- **Privilege Escalation**: RBAC en dos capas (Gateway + Microservicio) asegura verificacion redundante.
- **Token rotation**: Los ID Tokens de Firebase expiran cada hora. El refresh token de Firebase permite renovacion sin reautenticacion.
