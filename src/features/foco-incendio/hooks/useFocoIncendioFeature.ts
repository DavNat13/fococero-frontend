// src/features/foco-incendio/hooks/useFocoIncendioFeature.ts
import { useGetFocos, useCreateFoco } from '@/entities/foco-incendio/api/queries';
import { encolarAlertaOffline } from '../offline-strategy/offline';
import { useFocoIncendioStore } from '../model/store';
import { CrearAlertaDTO } from '@/entities/foco-incendio/model/types';

/**
 * Facade Hook: Orquesta la lógica del negocio aislando a los componentes (Widgets)
 * de las complejidades de la red y el manejo de estado global.
 */
export const useFocoIncendioFeature = () => {
  // 1. Estado del Servidor (React Query)
  const { data: focos, isLoading: isLoadingFocos, isError } = useGetFocos();
  const createMutation = useCreateFoco();

  // 2. Estado de la UI (Zustand)
  const { focoSeleccionado, filtroGravedadActivo, seleccionarFoco, setFiltroGravedad } =
    useFocoIncendioStore();

  // 3. Lógica Derivada
  const focosFiltrados =
    focos?.filter((f) => !filtroGravedadActivo || f.gravedad === filtroGravedadActivo) || [];

  // 4. Métodos Transaccionales (Con soporte Offline)
  const reportarNuevoFoco = async (data: CrearAlertaDTO, hasNetworkConnection: boolean) => {
    if (!hasNetworkConnection) {
      // Degradación elegante: Encolamos si no hay red
      await encolarAlertaOffline(data);
      return { success: true, offline: true };
    }

    try {
      await createMutation.mutateAsync(data);
      return { success: true, offline: false };
    } catch {
      // Fallback: Si el servidor falla repentinamente, encolamos
      await encolarAlertaOffline(data);
      return { success: true, offline: true, retry: true };
    }
  };

  return {
    // Datos
    focos: focosFiltrados,
    focoSeleccionado,
    isLoading: isLoadingFocos,
    isError,

    // Acciones UI
    seleccionarFoco,
    setFiltroGravedad,

    // Acciones Mutación
    reportarNuevoFoco,
    isCreating: createMutation.isPending,
  };
};
