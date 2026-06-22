import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { getFirebaseAuth } from '@core/config/firebase.config';
import { useAuthStore } from '../model/auth.store';

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);

export async function performLogout() {
  console.log('[Logout] Iniciando cierre de sesión...');

  const logoutPromise = (async () => {
    try {
      const auth = getFirebaseAuth();
      await withTimeout(firebaseSignOut(auth), 5000);
    } catch {
      // Silencioso
    }

    try {
      await withTimeout(GoogleSignin.signOut(), 5000);
    } catch {
      // Silencioso
    }

    try {
      await withTimeout(GoogleSignin.revokeAccess(), 5000);
    } catch {
      // Silencioso
    }

    await useAuthStore.getState().logout();
  })();

  // Timeout global de 8s para evitar colgar la navegación
  try {
    await withTimeout(logoutPromise, 8000);
  } catch {
    // Forzar logout en store aunque las operaciones fallen
    useAuthStore.setState({
      status: 'unauthenticated',
      user: null,
      firebaseToken: null,
    });
  }

  console.log('[Logout] Completado, navegando a /');
}
