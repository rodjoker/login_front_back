// components/Button.tsx - Componente de botón que usa la librería de colores
import React from 'react';
import { colors } from '@/lib/colors';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
type Size = 'sm' | 'md' | 'lg';

// Extiende TODAS las props nativas de <button> (onClick, disabled, type,
// aria-label, title, form, onKeyDown, ref, etc.) y agrega solo las propias.
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean; // muestra spinner y bloquea el click
  fullWidth?: boolean; // atajo para w-full
}

const variantColors: Record<Variant, string> = {
  primary: colors.buttonColorPrincipal,
  secondary: colors.buttonColorSecundario,
  success: colors.buttonColorSuccess,
  danger: colors.buttonColorDanger,
  warning: colors.buttonColorWarning,
};

// Clases completas y literales: Tailwind solo genera las que ve escritas.
const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  children= ' Send',
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  type = 'button', // evita que envíe formularios sin querer
  className = '',
  style,
  ...rest // onClick y cualquier otra prop nativa pasan directo al <button>
}) => {
  const color = variantColors[variant];
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={[
        sizeClasses[size],
        fullWidth && 'w-full',
        'rounded-md font-medium border transition-all duration-200',
        'enabled:hover:opacity-90 enabled:cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundColor: color,
        borderColor: color,
        color: '#ffffff',
        ...style,
      }}
      {...rest}
    >
      {loading && (
        <svg
          className="inline-block w-4 h-4 mr-2 align-[-2px] animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
          <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
