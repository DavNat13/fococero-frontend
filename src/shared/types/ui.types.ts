// src/shared/types/ui.types.ts

/**
 * TAMAÑOS (T-Shirt Sizing)
 * Estandarización de tamaños para íconos, botones y espaciados.
 */
export type SizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * PALETA DE COLORES SEMÁNTICOS
 * No usamos "rojo" o "naranja", usamos la intención del color en FocoCero.
 */
export type ColorTheme =
  | 'brand' // Naranja FocoCero (Primario)
  | 'primary' // Color principal del contenido (Blanco/Gris muy claro)
  | 'secondary' // Textos secundarios o bordes (Gris medio)
  | 'tertiary' // Elementos desactivados o fondos sutiles
  | 'success' // Verde (Reportes enviados, online)
  | 'warning' // Amarillo/Naranja claro (Advertencias, acceso invitado)
  | 'danger' // Rojo (Incendios, errores críticos, desconexión)
  | 'surface' // Fondos de tarjetas o modales
  | 'background'; // Fondo base de la app

/**
 * VARIANTES DE BOTONES
 * Contratos estrictos para el componente Button.tsx
 */
export type ButtonVariant =
  | 'solid' // Fondo lleno (Ej: Login)
  | 'outline' // Solo borde (Ej: Crear Cuenta)
  | 'ghost' // Sin fondo ni borde, solo texto (Ej: Olvidé contraseña)
  | 'warning' // Estilo de emergencia (Ej: Modo Despliegue Rápido)
  | 'danger'; // Acción destructiva (Ej: Eliminar reporte)

/**
 * VARIANTES DE TIPOGRAFÍA
 * Para el componente Typography.tsx (Asegura la jerarquía visual)
 */
export type TypographyVariant =
  | 'display' // Títulos gigantes (Ej: Logo FocoCero)
  | 'h1' // Títulos de pantallas principales
  | 'h2' // Subtítulos de sección
  | 'h3' // Títulos de tarjetas
  | 'body' // Texto de lectura normal
  | 'caption' // Texto pequeño (Ej: "Emergencia" en el divisor)
  | 'label'; // Texto de inputs (Ej: "RUT", "Contraseña")

/**
 * CONTRATO PARA ÍCONOS VECTORIALES (Lucide)
 * Todo ícono en FocoCero debe aceptar al menos estas propiedades.
 */
export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}
