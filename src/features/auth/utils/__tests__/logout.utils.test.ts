import { performLogout } from '../logout.utils';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useAuthStore } from '../../model/auth.store';

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    signOut: jest.fn(),
    revokeAccess: jest.fn(),
  },
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}));

jest.mock('@core/config/firebase.config', () => ({
  getFirebaseAuth: jest.fn(() => ({})),
}));

jest.mock('../../model/auth.store', () => ({
  useAuthStore: {
    getState: jest.fn(),
    setState: jest.fn(),
  },
}));

describe('performLogout (cierre de sesión)', () => {
  const mockLogout = jest.fn();
  const mockGetState = useAuthStore.getState as jest.Mock;
  const mockSetState = useAuthStore.setState as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogout.mockResolvedValue(undefined);
    mockGetState.mockReturnValue({ logout: mockLogout });
    (GoogleSignin.signOut as jest.Mock).mockResolvedValue(undefined);
    (GoogleSignin.revokeAccess as jest.Mock).mockResolvedValue(undefined);
    (firebaseSignOut as jest.Mock).mockResolvedValue(undefined);
  });

  it('ejecuta todas las operaciones de cierre de sesión', async () => {
    await performLogout();

    expect(firebaseSignOut).toHaveBeenCalled();
    expect(GoogleSignin.signOut).toHaveBeenCalled();
    expect(GoogleSignin.revokeAccess).toHaveBeenCalled();
    expect(mockLogout).toHaveBeenCalled();
  });

  it('no falla si firebaseSignOut lanza error', async () => {
    (firebaseSignOut as jest.Mock).mockRejectedValue(new Error('Firebase error'));

    await expect(performLogout()).resolves.not.toThrow();
    expect(GoogleSignin.signOut).toHaveBeenCalled();
    expect(mockLogout).toHaveBeenCalled();
  });

  it('no falla si GoogleSignin.signOut lanza error', async () => {
    (GoogleSignin.signOut as jest.Mock).mockRejectedValue(new Error('Google error'));

    await expect(performLogout()).resolves.not.toThrow();
    expect(mockLogout).toHaveBeenCalled();
  });

  it('fuerza logout en store si el timeout global se excede', async () => {
    // Simular que logout nunca se resuelve
    mockLogout.mockImplementation(() => new Promise(() => {})); // Never resolves

    await performLogout();

    expect(mockSetState).toHaveBeenCalledWith({
      status: 'unauthenticated',
      user: null,
      firebaseToken: null,
    });
  }, 15000);
});
