// src/features/auth/index.ts

export { useLogin } from './hooks/useLogin';

export {
  useUser,
  useAuthStatus,
  useIsAuthenticated,
  useIsGuest,
  useAuthActions,
  useIsHydrated,
  useFirebaseToken,
} from './model/auth.selectors';

export { registerFormSchema } from './model/auth.schemas';
export type { RegisterFormData } from './model/auth.schemas';

export { RequireAuth } from './ui/guards/RequireAuth';
export { LogoutButton } from './ui/components/LogoutButton';
