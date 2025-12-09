// colors.js - FUENTE ÚNICA DE VERDAD PARA COLORES DE LA APLICACIÓN

/**
 * COLORS - Sistema centralizado de colores para Tailwind CSS
 * 
 * INSTRUCCIONES:
 * 1. CAMBIA LOS COLORES EN LA SECCIÓN "CONFIGURACIÓN DE COLORES"
 * 2. Ejecuta el servidor de desarrollo para ver los cambios
 * 3. Los cambios se reflejarán en TODO tu proyecto automáticamente
 */

// ==================== CONFIGURACIÓN DE COLORES (¡CAMBIA AQUÍ!) ====================
// ⭐⭐ MODIFICA ESTOS VALORES PARA CAMBIAR TODOS LOS COLORES DE TU APP ⭐⭐

const COLOR_CONFIG = {
  // COLOR PRINCIPAL (brand color)
  primary: {
    50: '#faf5ff',    // Muy claro
    100: '#f3e8ff',   // Claro
    200: '#e9d5ff',   // 
    300: '#d8b4fe',   // 
    400: '#c084fc',   // 
    500: '#a855f7',   // Medio
    600: '#7c3aed',   // PRIMARIO (cambia este)
    700: '#6d28d9',   // SECUNDARIO (cambia este)
    800: '#5b21b6',   // Oscuro
    900: '#4c1d95',   // Muy oscuro
  },
  
  // COLORES DE ESTADO (puedes personalizar)
  status: {
    success: '#10b981',    // Verde
    warning: '#f59e0b',    // Ámbar/Naranja
    error: '#ef4444',      // Rojo
    info: '#3b82f6',       // Azul
  },
  
  // ESCALA DE GRISES (opcional cambiar)
  gray: {
    50: '#f9fafb',     // bgLight
    100: '#f3f4f6',
    200: '#e5e7eb',    // borderGray
    300: '#d1d5db',
    400: '#9ca3af',    // textMuted
    500: '#6b7280',    // textLight
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',    // textDark
    900: '#111827',
  },
  
  // COLORES ESPECÍFICOS PARA STATUS
  statusSpecific: {
    open: '#10b981',      // Verde
    closed: '#ef4444',    // Rojo
    results: '#3b82f6',   // Azul
  },
};

// ==================== GENERACIÓN AUTOMÁTICA (NO MODIFICAR) ====================
// Los siguientes objetos se generan AUTOMÁTICAMENTE basados en COLOR_CONFIG

// HEX_COLORS para estilos en línea
export const HEX_COLORS = {
  // Colores base
  primary: COLOR_CONFIG.primary[600],
  secondary: COLOR_CONFIG.primary[700],
  
  // Estados
  success: COLOR_CONFIG.status.success,
  warning: COLOR_CONFIG.status.warning,
  error: COLOR_CONFIG.status.error,
  info: COLOR_CONFIG.status.info,
  
  // Tonos de texto
  textDark: COLOR_CONFIG.gray[800],
  textLight: COLOR_CONFIG.gray[500],
  textMuted: COLOR_CONFIG.gray[400],
  
  // Fondos
  bgLight: COLOR_CONFIG.gray[50],
  bgWhite: '#ffffff',
  
  // Bordes
  borderGray: COLOR_CONFIG.gray[200],
  
  // Status indicators

  statusOpen: COLOR_CONFIG.statusSpecific.open,
  statusClosed: COLOR_CONFIG.statusSpecific.closed,
  statusResults: COLOR_CONFIG.statusSpecific.results,
};

// COLOR_CLASSES para Tailwind CSS
export const COLOR_CLASSES = {
  // Gradientes
  gradients: {
    primary: `bg-gradient-to-r from-[${COLOR_CONFIG.primary[600]}] to-[${COLOR_CONFIG.primary[700]}]`,
    secondary: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    primaryVertical: `bg-gradient-to-b from-[${COLOR_CONFIG.primary[600]}] to-[${COLOR_CONFIG.primary[700]}]`,
    success: `bg-gradient-to-r from-[${COLOR_CONFIG.status.success}] to-[${darkenColor(COLOR_CONFIG.status.success, 20)}]`,
    warning: `bg-gradient-to-r from-[${COLOR_CONFIG.status.warning}] to-[${darkenColor(COLOR_CONFIG.status.warning, 20)}]`,
    error: `bg-gradient-to-r from-[${COLOR_CONFIG.status.error}] to-[${darkenColor(COLOR_CONFIG.status.error, 20)}]`,
    info: `bg-gradient-to-r from-[${COLOR_CONFIG.status.info}] to-[${darkenColor(COLOR_CONFIG.status.info, 20)}]`,
  },
  
  // Colores de fondo
  backgrounds: {
    primary: `bg-[${COLOR_CONFIG.primary[600]}]`,
    primaryHover: `hover:bg-[${COLOR_CONFIG.primary[700]}]`,
    primaryLight: `bg-[${COLOR_CONFIG.primary[50]}]`,
    secondary: `bg-[${COLOR_CONFIG.primary[700]}]`,
    light: `bg-[${COLOR_CONFIG.gray[50]}]`,
    white: 'bg-white',
    success: `bg-[${COLOR_CONFIG.status.success}]`,
    warning: `bg-[${COLOR_CONFIG.status.warning}]`,
    error: `bg-[${COLOR_CONFIG.status.error}]`,
    info: `bg-[${COLOR_CONFIG.status.info}]`,
  },
  
  // Colores de texto
  text: {
    dark: `text-[${COLOR_CONFIG.gray[800]}]`,
    light: `text-[${COLOR_CONFIG.gray[500]}]`,
    muted: `text-[${COLOR_CONFIG.gray[400]}]`,
    white: 'text-white',
    primary: `text-[${COLOR_CONFIG.primary[600]}]`,
    primaryDark: `text-[${COLOR_CONFIG.primary[700]}]`,
    success: `text-[${COLOR_CONFIG.status.success}]`,
    warning: `text-[${COLOR_CONFIG.status.warning}]`,
    error: `text-[${COLOR_CONFIG.status.error}]`,
    info: `text-[${COLOR_CONFIG.status.info}]`,
  },
  
  // Bordes
  borders: {
    gray: `border border-[${COLOR_CONFIG.gray[200]}]`,
    primary: `border border-[${COLOR_CONFIG.primary[600]}]`,
    success: `border border-[${COLOR_CONFIG.status.success}]`,
    warning: `border border-[${COLOR_CONFIG.status.warning}]`,
    error: `border border-[${COLOR_CONFIG.status.error}]`,
    info: `border border-[${COLOR_CONFIG.status.info}]`,
  },
  
  // Estados
  status: {
    open: `bg-[${lightenColor(COLOR_CONFIG.statusSpecific.open, 80)}] text-[${darkenColor(COLOR_CONFIG.statusSpecific.open, 20)}] border-[${lightenColor(COLOR_CONFIG.statusSpecific.open, 60)}]`,
    closed: `bg-[${lightenColor(COLOR_CONFIG.statusSpecific.closed, 80)}] text-[${darkenColor(COLOR_CONFIG.statusSpecific.closed, 20)}] border-[${lightenColor(COLOR_CONFIG.statusSpecific.closed, 60)}]`,
    results: `bg-[${lightenColor(COLOR_CONFIG.statusSpecific.results, 80)}] text-[${darkenColor(COLOR_CONFIG.statusSpecific.results, 20)}] border-[${lightenColor(COLOR_CONFIG.statusSpecific.results, 60)}]`,
    warning: `bg-[${lightenColor(COLOR_CONFIG.status.warning, 80)}] text-[${darkenColor(COLOR_CONFIG.status.warning, 20)}] border-[${lightenColor(COLOR_CONFIG.status.warning, 60)}]`,
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  
  // Componentes predefinidos
  components: {
    button: {
      primary: `bg-[${COLOR_CONFIG.primary[600]}] hover:bg-[${COLOR_CONFIG.primary[700]}] text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200`,
      secondary: `bg-[${COLOR_CONFIG.gray[200]}] hover:bg-[${COLOR_CONFIG.gray[300]}] text-[${COLOR_CONFIG.gray[800]}] font-medium rounded-lg px-4 py-2 transition-colors duration-200`,
      outline: `border border-[${COLOR_CONFIG.primary[600]}] text-[${COLOR_CONFIG.primary[600]}] hover:bg-[${COLOR_CONFIG.primary[50]}] font-medium rounded-lg px-4 py-2 transition-colors duration-200`,
      success: `bg-[${COLOR_CONFIG.status.success}] hover:bg-[${darkenColor(COLOR_CONFIG.status.success, 10)}] text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200`,
      error: `bg-[${COLOR_CONFIG.status.error}] hover:bg-[${darkenColor(COLOR_CONFIG.status.error, 10)}] text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200`,
    },
    card: {
      base: `bg-white rounded-lg border border-[${COLOR_CONFIG.gray[200]}] shadow-sm`,
      elevated: `bg-white rounded-lg border border-[${COLOR_CONFIG.gray[200]}] shadow-md`,
    },
    input: {
      base: `w-full px-3 py-2 border border-[${COLOR_CONFIG.gray[300]}] rounded-md focus:outline-none focus:ring-2 focus:ring-[${COLOR_CONFIG.primary[600]}] focus:border-transparent`,
      error: `border-[${COLOR_CONFIG.status.error}] focus:ring-[${COLOR_CONFIG.status.error}]`,
      success: `border-[${COLOR_CONFIG.status.success}] focus:ring-[${COLOR_CONFIG.status.success}]`,
    },
  },
};

// ==================== FUNCIONES HELPER (NO MODIFICAR) ====================

/**
 * Oscurece un color hexadecimal
 */
function darkenColor(color, percent) {
  if (!color.startsWith('#')) return color;
  
  // Para simplificar, si es un color conocido de Tailwind, devolvemos uno oscurecido
  const colorMap = {
    '#10b981': '#0da271', // success oscurecido
    '#f59e0b': '#d97706', // warning oscurecido
    '#ef4444': '#dc2626', // error oscurecido
    '#3b82f6': '#2563eb', // info oscurecido
  };
  
  return colorMap[color] || color;
}

/**
 * Aclara un color hexadecimal
 */
function lightenColor(color, percent) {
  if (!color.startsWith('#')) return color;
  
  // Para simplificar, si es un color conocido de Tailwind, devolvemos uno aclarado
  const colorMap = {
    '#10b981': '#a7f3d0', // success aclarado (~bg-green-100)
    '#ef4444': '#fecaca', // error aclarado (~bg-red-100)
    '#3b82f6': '#dbeafe', // info aclarado (~bg-blue-100)
    '#f59e0b': '#fef3c7', // warning aclarado (~bg-yellow-100)
  };
  
  return colorMap[color] || color;
}

/**
 * Genera clases de gradiente de Tailwind
 */
export function getGradient(type = 'primary', direction = 'r') {
  const directionMap = {
    r: 'bg-gradient-to-r',
    l: 'bg-gradient-to-l',
    t: 'bg-gradient-to-t',
    b: 'bg-gradient-to-b',
    tr: 'bg-gradient-to-tr',
    tl: 'bg-gradient-to-tl',
    br: 'bg-gradient-to-br',
    bl: 'bg-gradient-to-bl',
  };
  
  const gradientMap = {
    primary: `from-[${COLOR_CONFIG.primary[600]}] to-[${COLOR_CONFIG.primary[700]}]`,
    secondary: 'from-blue-50 to-indigo-50',
    success: `from-[${COLOR_CONFIG.status.success}] to-[${darkenColor(COLOR_CONFIG.status.success, 20)}]`,
    error: `from-[${COLOR_CONFIG.status.error}] to-[${darkenColor(COLOR_CONFIG.status.error, 20)}]`,
    warning: `from-[${COLOR_CONFIG.status.warning}] to-[${darkenColor(COLOR_CONFIG.status.warning, 20)}]`,
    info: `from-[${COLOR_CONFIG.status.info}] to-[${darkenColor(COLOR_CONFIG.status.info, 20)}]`,
  };
  
  const dirClass = directionMap[direction] || directionMap.r;
  const gradClass = gradientMap[type] || gradientMap.primary;
  
  return `${dirClass} ${gradClass}`;
}

/**
 * Obtiene clases de Tailwind para diferentes estados
 */
export function getStatusClasses(status) {
  const statusMap = {
    open: COLOR_CLASSES.status.open,
    closed: COLOR_CLASSES.status.closed,
    results: COLOR_CLASSES.status.results,
    warning: COLOR_CLASSES.status.warning,
    pending: COLOR_CLASSES.status.pending,
  };
  
  return statusMap[status] || COLOR_CLASSES.status.warning;
}

/**
 * Helper para combinar clases
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ==================== CONFIGURACIÓN PARA TAILWIND.CONFIG.JS ====================
/**
 * Copia y pega esto en tu tailwind.config.js para tener acceso completo
 */
export const TAILWIND_CONFIG = {
  colors: COLOR_CONFIG,
  
  getTailwindConfig: () => ({
    theme: {
      extend: {
        colors: {
          primary: COLOR_CONFIG.primary,
          gray: COLOR_CONFIG.gray,
          success: COLOR_CONFIG.status.success,
          warning: COLOR_CONFIG.status.warning,
          error: COLOR_CONFIG.status.error,
          info: COLOR_CONFIG.status.info,
        },
      },
    },
  }),
};

// ==================== EXPORT POR DEFECTO ====================
/**
 * Para compatibilidad con código existente
 */
const COLORS = {
  primaryGradient: `from-[${COLOR_CONFIG.primary[600]}] to-[${COLOR_CONFIG.primary[700]}]`,
  secondaryGradient: 'from-blue-50 to-indigo-50',
  primary: COLOR_CONFIG.primary[600],
  secondary: COLOR_CONFIG.primary[700],
  success: COLOR_CONFIG.status.success,
  warning: COLOR_CONFIG.status.warning,
  error: COLOR_CONFIG.status.error,
  info: COLOR_CONFIG.status.info,
  textDark: COLOR_CONFIG.gray[800],
  textLight: COLOR_CONFIG.gray[500],
  textMuted: COLOR_CONFIG.gray[400],
  bgLight: COLOR_CONFIG.gray[50],
  bgWhite: '#ffffff',
  borderGray: COLOR_CONFIG.gray[200],
  statusOpen: COLOR_CONFIG.statusSpecific.open,
  statusClosed: COLOR_CONFIG.statusSpecific.closed,
  statusResults: COLOR_CONFIG.statusSpecific.results,
};

export default COLORS;

// ==================== INSTRUCCIONES DE USO ====================
/**
 * EJEMPLOS:
 * 
 * 1. Cambiar color primario:
 *    - Modifica COLOR_CONFIG.primary[600] y [700]
 *    - Ej: Cambia '#7c3aed' a '#3b82f6' para azul
 * 
 * 2. Cambiar color de éxito:
 *    - Modifica COLOR_CONFIG.status.success
 *    - Ej: Cambia '#10b981' a '#22c55e'
 * 
 * 3. Uso en componentes:
 *    import { COLOR_CLASSES } from './colors';
 *    
 *    // En tu JSX
 *    <div className={COLOR_CLASSES.gradients.primary}>
 *    <button className={COLOR_CLASSES.components.button.primary}>
 *    
 * 4. Para valores HEX (estilos en línea):
 *    import { HEX_COLORS } from './colors';
 *    
 *    <div style={{ backgroundColor: HEX_COLORS.primary }}>
 */

