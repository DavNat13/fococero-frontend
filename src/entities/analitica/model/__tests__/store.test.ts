import { useAnaliticaStore } from '../store';

describe('useAnaliticaStore (almacén de analítica)', () => {
  beforeEach(() => {
    useAnaliticaStore.setState({
      kpis: null,
      heatmap: [],
      predicciones: [],
      filtrosActivos: {},
      periodoSeleccionado: '7d',
      isLoading: false,
      error: null,
    });
  });

  it('inicializa con valores por defecto', () => {
    const state = useAnaliticaStore.getState();
    expect(state.kpis).toBeNull();
    expect(state.heatmap).toEqual([]);
    expect(state.predicciones).toEqual([]);
    expect(state.filtrosActivos).toEqual({});
    expect(state.periodoSeleccionado).toBe('7d');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setKPIs establece los KPIs', () => {
    const kpis = { totalAlertas: 10, alertasActivas: 5 } as any;
    useAnaliticaStore.getState().setKPIs(kpis);
    expect(useAnaliticaStore.getState().kpis).toEqual(kpis);
  });

  it('setHeatmap establece los datos de calor', () => {
    const heatmap = [{ latitud: -33.45, longitud: -70.65, intensidad: 0.8, cantidad: 5 }];
    useAnaliticaStore.getState().setHeatmap(heatmap);
    expect(useAnaliticaStore.getState().heatmap).toEqual(heatmap);
  });

  it('setPredicciones establece las predicciones', () => {
    const predicciones = [{ id: '1', fechaPredicha: '2026-01-01', probabilidad: 0.7 } as any];
    useAnaliticaStore.getState().setPredicciones(predicciones);
    expect(useAnaliticaStore.getState().predicciones).toEqual(predicciones);
  });

  it('setFiltros actualiza los filtros activos', () => {
    useAnaliticaStore.getState().setFiltros({ region: 'Metropolitana' });
    expect(useAnaliticaStore.getState().filtrosActivos).toEqual({ region: 'Metropolitana' });
  });

  it('setPeriodo actualiza el período', () => {
    useAnaliticaStore.getState().setPeriodo('30d');
    expect(useAnaliticaStore.getState().periodoSeleccionado).toBe('30d');
  });

  it('setLoading actualiza el estado de carga', () => {
    useAnaliticaStore.getState().setLoading(true);
    expect(useAnaliticaStore.getState().isLoading).toBe(true);
  });

  it('setError actualiza el error', () => {
    useAnaliticaStore.getState().setError('Error al cargar');
    expect(useAnaliticaStore.getState().error).toBe('Error al cargar');
  });

  it('limpiarFiltros resetea filtros y error', () => {
    useAnaliticaStore.setState({
      filtrosActivos: { region: 'Valparaíso' },
      error: 'Error',
    });

    useAnaliticaStore.getState().limpiarFiltros();

    expect(useAnaliticaStore.getState().filtrosActivos).toEqual({});
    expect(useAnaliticaStore.getState().error).toBeNull();
  });
});
