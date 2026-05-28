export const getNivelColor = (nivel: string): string => {
  switch (nivel) {
    case 'critico':
      return '#DC2626';
    case 'alto':
      return '#EF4444';
    case 'medio':
      return '#F97316';
    case 'bajo':
      return '#22C55E';
    default:
      return '#6B7280';
  }
};

export const getNivelIcon = (nivel: string): string => {
  switch (nivel) {
    case 'critico':
      return 'alert-octagon';
    case 'alto':
      return 'fire';
    case 'medio':
      return 'fire-alert';
    case 'bajo':
      return 'fire-extinguisher';
    default:
      return 'alert';
  }
};

export function mapEstado(estado: string): string {
  switch (estado) {
    case 'PENDIENTE':
      return 'pendiente';
    case 'EN_REVISION':
      return 'en_proceso';
    case 'APROBADO':
    case 'CERRADO':
      return 'resuelto';
    default:
      return 'pendiente';
  }
}

export function getEstadoLabel(estado: string): string {
  switch (mapEstado(estado)) {
    case 'pendiente':
      return 'Pendiente';
    case 'en_proceso':
      return 'En proceso';
    case 'resuelto':
      return 'Resuelto';
    default:
      return 'Desconocido';
  }
}

export function mapEstadoANivel(estado: string): string {
  switch (estado) {
    case 'CRITICA':
    case 'EN_PROCESO':
      return 'alto';
    case 'PENDIENTE':
    case 'REPORTADA':
      return 'medio';
    case 'VERIFICADA':
    case 'RESUELTA':
    case 'DESCARTADA':
      return 'bajo';
    default:
      return 'medio';
  }
}

export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case 'activa':
      return '#EF4444';
    case 'controlada':
      return '#F97316';
    case 'extinguida':
      return '#22C55E';
    case 'pendiente':
      return '#F97316';
    case 'en_proceso':
      return '#3B82F6';
    case 'resuelto':
      return '#22C55E';
    default:
      return '#6B7280';
  }
};

export const getEstadoIcon = (estado: string): string => {
  switch (estado) {
    case 'activa':
      return 'alert-circle';
    case 'controlada':
      return 'progress-clock';
    case 'extinguida':
      return 'check-circle';
    default:
      return 'information';
  }
};
