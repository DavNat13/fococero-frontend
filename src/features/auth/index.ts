// src/features/auth/index.ts

export { useLogin } from './hooks/useLogin';
export { useGoogleAuth } from './hooks/useGoogleAuth';
export { useSession } from './hooks/useSession';

export { useAuthStore } from './model/auth.store';

export {
  useUser,
  useAuthStatus,
  useIsAuthenticated,
  useIsGuest,
  useAuthActions,
  useIsHydrated,
  useFirebaseToken,
} from './model/auth.selectors';

export { registerFormSchema, loginSchema } from './model/auth.schemas';
export type { RegisterFormData, LoginFormData } from './model/auth.schemas';

export { RequireAuth } from './ui/guards/RequireAuth';
export { LogoutButton } from './ui/components/LogoutButton';

export { authApi } from './api/auth.api';
export type { LoginCredentials } from './api/auth.api';
