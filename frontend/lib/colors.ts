// lib/colors.ts - Librería de Colores Centralizada
// Este archivo contiene todos los colores utilizados en la aplicación
// Permite cambios centralizados que se reflejan automáticamente en toda la app

export interface ColorPalette {
  // Colores Base del Sistema
  backgroundColor: string;
  backgroundSecondary: string;
  foregroundColor: string;
  foregroundSecondary: string;

  // Colores Principales
  primaryColor: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;

  // Colores Secundarios
  secondaryColor: string;
  secondaryHover: string;
  secondaryLight: string;
  secondaryDark: string;

  // Colores de Acento
  accentColor: string;
  accentHover: string;
  accentLight: string;
  accentDark: string;

  // Colores de Botones
  buttonColorPrincipal: string;
  buttonColorSecundario: string;
  buttonColorSuccess: string;
  buttonColorDanger: string;
  buttonColorWarning: string;

  // Estados de Interacción
  colorSuccess: string;
  colorSuccessLight: string;
  colorError: string;
  colorErrorLight: string;
  colorWarning: string;
  colorWarningLight: string;
  colorInfo: string;
  colorInfoLight: string;

  // Escala de Grises
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;

  // Colores de Borde
  borderColor: string;
  borderColorHover: string;
  borderColorFocus: string;
}

// Colores usando CSS Variables (recomendado)
export const colors: ColorPalette = {
  // Colores Base del Sistema
  backgroundColor: 'var(--background-color)',
  backgroundSecondary: 'var(--background-secondary)',
  foregroundColor: 'var(--foreground-color)',
  foregroundSecondary: 'var(--foreground-secondary)',

  // Colores Principales
  primaryColor: 'var(--primary-color)',
  primaryHover: 'var(--primary-hover)',
  primaryLight: 'var(--primary-light)',
  primaryDark: 'var(--primary-dark)',

  // Colores Secundarios
  secondaryColor: 'var(--secondary-color)',
  secondaryHover: 'var(--secondary-hover)',
  secondaryLight: 'var(--secondary-light)',
  secondaryDark: 'var(--secondary-dark)',

  // Colores de Acento
  accentColor: 'var(--accent-color)',
  accentHover: 'var(--accent-hover)',
  accentLight: 'var(--accent-light)',
  accentDark: 'var(--accent-dark)',

  // Colores de Botones
  buttonColorPrincipal: 'var(--button-color-principal)',
  buttonColorSecundario: 'var(--button-color-secundario)',
  buttonColorSuccess: 'var(--button-color-success)',
  buttonColorDanger: 'var(--button-color-danger)',
  buttonColorWarning: 'var(--button-color-warning)',

  // Estados de Interacción
  colorSuccess: 'var(--color-success)',
  colorSuccessLight: 'var(--color-success-light)',
  colorError: 'var(--color-error)',
  colorErrorLight: 'var(--color-error-light)',
  colorWarning: 'var(--color-warning)',
  colorWarningLight: 'var(--color-warning-light)',
  colorInfo: 'var(--color-info)',
  colorInfoLight: 'var(--color-info-light)',

  // Escala de Grises
  gray50: 'var(--gray-50)',
  gray100: 'var(--gray-100)',
  gray200: 'var(--gray-200)',
  gray300: 'var(--gray-300)',
  gray400: 'var(--gray-400)',
  gray500: 'var(--gray-500)',
  gray600: 'var(--gray-600)',
  gray700: 'var(--gray-700)',
  gray800: 'var(--gray-800)',
  gray900: 'var(--gray-900)',

  // Colores de Borde
  borderColor: 'var(--border-color)',
  borderColorHover: 'var(--border-color-hover)',
  borderColorFocus: 'var(--border-color-focus)',
};

// Valores hexadecimales directos (opcional, para casos específicos)
export const rawColors = {
  // Modo Claro
  light: {
    backgroundColor: '#ffffff',
    backgroundSecondary: '#f8fafc',
    foregroundColor: '#171717',
    foregroundSecondary: '#64748b',
    primaryColor: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#dbeafe',
    primaryDark: '#1e40af',
    secondaryColor: '#6366f1',
    secondaryHover: '#4f46e5',
    secondaryLight: '#e0e7ff',
    secondaryDark: '#3730a3',
    accentColor: '#10b981',
    accentHover: '#059669',
    accentLight: '#d1fae5',
    accentDark: '#047857',
    buttonColorPrincipal: '#3b82f6',
    buttonColorSecundario: '#64748b',
    buttonColorSuccess: '#10b981',
    buttonColorDanger: '#ef4444',
    buttonColorWarning: '#f59e0b',
    colorSuccess: '#10b981',
    colorSuccessLight: '#d1fae5',
    colorError: '#ef4444',
    colorErrorLight: '#fee2e2',
    colorWarning: '#f59e0b',
    colorWarningLight: '#fef3c7',
    colorInfo: '#3b82f6',
    colorInfoLight: '#dbeafe',
    gray50: '#f8fafc',
    gray100: '#f1f5f9',
    gray200: '#e2e8f0',
    gray300: '#cbd5e1',
    gray400: '#94a3b8',
    gray500: '#64748b',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1e293b',
    gray900: '#0f172a',
    borderColor: '#e2e8f0',
    borderColorHover: '#cbd5e1',
    borderColorFocus: '#3b82f6',
  },
  // Modo Oscuro
  dark: {
    backgroundColor: '#0a0a0a',
    backgroundSecondary: '#171717',
    foregroundColor: '#ededed',
    foregroundSecondary: '#a1a1aa',
    primaryColor: '#60a5fa',
    primaryHover: '#3b82f6',
    primaryLight: '#1e3a8a',
    primaryDark: '#93c5fd',
    secondaryColor: '#818cf8',
    secondaryHover: '#6366f1',
    secondaryLight: '#312e81',
    secondaryDark: '#a5b4fc',
    accentColor: '#34d399',
    accentHover: '#10b981',
    accentLight: '#064e3b',
    accentDark: '#6ee7b7',
    buttonColorPrincipal: '#60a5fa',
    buttonColorSecundario: '#71717a',
    buttonColorSuccess: '#34d399',
    buttonColorDanger: '#f87171',
    buttonColorWarning: '#fbbf24',
    colorSuccess: '#34d399',
    colorSuccessLight: '#064e3b',
    colorError: '#f87171',
    colorErrorLight: '#7f1d1d',
    colorWarning: '#fbbf24',
    colorWarningLight: '#78350f',
    colorInfo: '#60a5fa',
    colorInfoLight: '#1e3a8a',
    gray50: '#0f172a',
    gray100: '#1e293b',
    gray200: '#334155',
    gray300: '#475569',
    gray400: '#64748b',
    gray500: '#94a3b8',
    gray600: '#cbd5e1',
    gray700: '#e2e8f0',
    gray800: '#f1f5f9',
    gray900: '#f8fafc',
    borderColor: '#374151',
    borderColorHover: '#4b5563',
    borderColorFocus: '#60a5fa',
  }
};

// Helper functions para usar en componentes
export const getColor = (colorName: keyof ColorPalette): string => {
  return colors[colorName];
};

// Funciones de utilidad
export const buttonColors = {
  primary: colors.buttonColorPrincipal,
  secondary: colors.buttonColorSecundario,
  success: colors.buttonColorSuccess,
  danger: colors.buttonColorDanger,
  warning: colors.buttonColorWarning,
};

export const stateColors = {
  success: colors.colorSuccess,
  successLight: colors.colorSuccessLight,
  error: colors.colorError,
  errorLight: colors.colorErrorLight,
  warning: colors.colorWarning,
  warningLight: colors.colorWarningLight,
  info: colors.colorInfo,
  infoLight: colors.colorInfoLight,
};

export default colors;