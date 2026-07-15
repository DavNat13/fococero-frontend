import { useReporteStore } from '../store';
import type { Reporte, Categoria } from '../../api/reporte.api';

describe('useReporteStore (almacén de reportes)', () => {
  beforeEach(() => {
    useReporteStore.setState({
      reportes: [],
      misReportes: [],
      reporteSeleccionado: null,
      categorias: [],
      filtroEstado: null,
      filtroCategoria: null,
      isLoading: false,
      error: null,
    });
  });

  describe('estado inicial', () => {
    it('inicializa con valores por defecto', () => {
      const state = useReporteStore.getState();
      expect(state.reportes).toEqual([]);
      expect(state.misReportes).toEqual([]);
      expect(state.reporteSeleccionado).toBeNull();
      expect(state.categorias).toEqual([]);
      expect(state.filtroEstado).toBeNull();
      expect(state.filtroCategoria).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('setReportes', () => {
    it('establece la lista de reportes', () => {
      const reportes = [{ id: '1', titulo: 'Test' }] as unknown as Reporte[];
      useReporteStore.getState().setReportes(reportes);
      expect(useReporteStore.getState().reportes).toEqual(reportes);
    });
  });

  describe('setMisReportes', () => {
    it('establece la lista de mis reportes', () => {
      const misReportes = [{ id: '2', titulo: 'Mi reporte' }] as unknown as Reporte[];
      useReporteStore.getState().setMisReportes(misReportes);
      expect(useReporteStore.getState().misReportes).toEqual(misReportes);
    });
  });

  describe('setReporteSeleccionado', () => {
    it('establece el reporte seleccionado', () => {
      const reporte = { id: '3', titulo: 'Seleccionado' } as unknown as Reporte;
      useReporteStore.getState().setReporteSeleccionado(reporte);
      expect(useReporteStore.getState().reporteSeleccionado).toEqual(reporte);
    });

    it('acepta null para limpiar selección', () => {
      useReporteStore.setState({ reporteSeleccionado: { id: '1' } as unknown as Reporte });
      useReporteStore.getState().setReporteSeleccionado(null);
      expect(useReporteStore.getState().reporteSeleccionado).toBeNull();
    });
  });

  describe('setCategorias', () => {
    it('establece las categorías', () => {
      const categorias = [{ id: 'cat1', nombre: 'Incendio' }] as unknown as Categoria[];
      useReporteStore.getState().setCategorias(categorias);
      expect(useReporteStore.getState().categorias).toEqual(categorias);
    });
  });

  describe('filtros', () => {
    it('setFiltroEstado actualiza el filtro de estado', () => {
      useReporteStore.getState().setFiltroEstado('PENDIENTE');
      expect(useReporteStore.getState().filtroEstado).toBe('PENDIENTE');
    });

    it('setFiltroCategoria actualiza el filtro de categoría', () => {
      useReporteStore.getState().setFiltroCategoria('cat1');
      expect(useReporteStore.getState().filtroCategoria).toBe('cat1');
    });

    it('limpiarFiltros resetea todos los filtros', () => {
      useReporteStore.setState({
        filtroEstado: 'PENDIENTE',
        filtroCategoria: 'cat1',
        reporteSeleccionado: { id: '1' } as unknown as Reporte,
        error: 'Error',
      });

      useReporteStore.getState().limpiarFiltros();

      const state = useReporteStore.getState();
      expect(state.filtroEstado).toBeNull();
      expect(state.filtroCategoria).toBeNull();
      expect(state.reporteSeleccionado).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('loading y error', () => {
    it('setLoading actualiza el estado de carga', () => {
      useReporteStore.getState().setLoading(true);
      expect(useReporteStore.getState().isLoading).toBe(true);
    });

    it('setError actualiza el mensaje de error', () => {
      useReporteStore.getState().setError('Error de conexión');
      expect(useReporteStore.getState().error).toBe('Error de conexión');
    });
  });
});
