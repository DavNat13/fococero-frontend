import { useAlertaStore } from '../store';

describe('useAlertaStore (almacén de alertas)', () => {
  beforeEach(() => {
    useAlertaStore.setState({
      alertas: [],
      alertaSeleccionada: null,
      filtroEstado: null,
      isLoading: false,
      error: null,
    });
  });

  it('inicializa con valores por defecto', () => {
    const state = useAlertaStore.getState();
    expect(state.alertas).toEqual([]);
    expect(state.alertaSeleccionada).toBeNull();
    expect(state.filtroEstado).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setAlertas establece las alertas', () => {
    const alertas = [{ id: '1', tipo: 'INCENDIO' } as any];
    useAlertaStore.getState().setAlertas(alertas);
    expect(useAlertaStore.getState().alertas).toEqual(alertas);
  });

  it('setAlertaSeleccionada establece la alerta activa', () => {
    const alerta = { id: '2', tipo: 'DERRAME' } as any;
    useAlertaStore.getState().setAlertaSeleccionada(alerta);
    expect(useAlertaStore.getState().alertaSeleccionada).toEqual(alerta);
  });

  it('setAlertaSeleccionada acepta null', () => {
    useAlertaStore.setState({ alertaSeleccionada: { id: '1' } as any });
    useAlertaStore.getState().setAlertaSeleccionada(null);
    expect(useAlertaStore.getState().alertaSeleccionada).toBeNull();
  });

  it('setFiltroEstado actualiza el filtro', () => {
    useAlertaStore.getState().setFiltroEstado('EN_REVISION');
    expect(useAlertaStore.getState().filtroEstado).toBe('EN_REVISION');
  });

  it('setLoading actualiza el estado de carga', () => {
    useAlertaStore.getState().setLoading(true);
    expect(useAlertaStore.getState().isLoading).toBe(true);
  });

  it('setError actualiza el error', () => {
    useAlertaStore.getState().setError('Error de red');
    expect(useAlertaStore.getState().error).toBe('Error de red');
  });

  it('limpiarFiltros resetea filtro, selección y error', () => {
    useAlertaStore.setState({
      filtroEstado: 'REPORTADA',
      alertaSeleccionada: { id: '1' } as any,
      error: 'Error',
    });

    useAlertaStore.getState().limpiarFiltros();

    const state = useAlertaStore.getState();
    expect(state.filtroEstado).toBeNull();
    expect(state.alertaSeleccionada).toBeNull();
    expect(state.error).toBeNull();
  });
});
