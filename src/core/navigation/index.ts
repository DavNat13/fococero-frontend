import { useRouter, type Href } from 'expo-router';
import * as Linking from 'expo-linking';

const PREFIXES = ['fococero://', 'https://fococero.cl'];

export type AppRoute = Href;

export const navigation = {
  prefixes: PREFIXES,
  config: {
    screens: {
      index: '',
      '(auth)/login': 'login',
      '(auth)/register': 'register',
      '(auth)/guest': 'guest',
      '(ciudadano)': 'ciudadano',
      '(ciudadano)/crear-reporte': 'ciudadano/reportar',
      '(ciudadano)/alertas': 'ciudadano/alertas',
      '(ciudadano)/perfil': 'ciudadano/perfil',
      '(brigadista)': 'brigadista',
      '(brigadista)/emergencias': 'brigadista/emergencias',
      '(brigadista)/reportes': 'brigadista/reportes',
      '(brigadista)/mapa': 'brigadista/mapa',
      '(brigadista)/perfil': 'brigadista/perfil',
      '(admin)': 'admin',
      '(admin)/usuarios': 'admin/usuarios',
      '(admin)/mapa': 'admin/mapa',
      '(admin)/config': 'admin/config',
      '(admin)/perfil': 'admin/perfil',
      modal: 'modal',
    },
  },
};

export const useDeepLink = () => {
  const router = useRouter();

  const handleDeepLink = (url: string) => {
    const parsed = Linking.parse(url);
    if (parsed.path) {
      const path = parsed.path.replace(/^\//, '');
      router.replace(`/${path}` as Href);
    }
  };

  return { handleDeepLink };
};
