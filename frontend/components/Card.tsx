// components/Card.tsx - Componente de tarjeta que usa la librería de colores
import React from 'react';
import { colors } from '@/lib/colors';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          borderColor: colors.colorSuccess,
          backgroundColor: colors.colorSuccessLight,
        };
      case 'error':
        return {
          borderColor: colors.colorError,
          backgroundColor: colors.colorErrorLight,
        };
      case 'warning':
        return {
          borderColor: colors.colorWarning,
          backgroundColor: colors.colorWarningLight,
        };
      case 'info':
        return {
          borderColor: colors.colorInfo,
          backgroundColor: colors.colorInfoLight,
        };
      default:
        return {
          borderColor: colors.borderColor,
          backgroundColor: colors.backgroundColor,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div
      className={`
        rounded-lg 
        border 
        p-6 
        shadow-sm 
        transition-shadow 
        duration-200 
        hover:shadow-md
        ${className}
      `}
      style={{
        borderColor: variantStyles.borderColor,
        backgroundColor: variantStyles.backgroundColor,
        color: colors.foregroundColor,
      }}
    >
      {title && (
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: colors.foregroundColor }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;