import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '8px 14px', fontSize: '0.875rem', borderRadius: 'var(--radius-md)', height: '36px' },
    md: { padding: '10px 18px', fontSize: '0.9375rem', borderRadius: 'var(--radius-md)', height: '44px' },
    lg: { padding: '13px 24px', fontSize: '1rem', borderRadius: 'var(--radius-lg)', height: '50px' }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
      color: '#ffffff',
      boxShadow: '0 2px 8px rgba(13, 148, 136, 0.28)',
      border: '1px solid #0d9488'
    },
    secondary: {
      background: 'var(--slate-100)',
      color: 'var(--slate-800)',
      border: '1px solid var(--slate-200)'
    },
    outline: {
      background: '#ffffff',
      color: 'var(--primary-700)',
      border: '1.5px solid var(--primary-600)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--slate-700)',
      border: '1px solid transparent'
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#ffffff',
      border: '1px solid #dc2626'
    }
  };

  const isInteractive = !disabled && !isLoading;

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        fontFamily: 'var(--font-heading)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: isInteractive ? 'pointer' : 'not-allowed',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        position: 'relative',
        userSelect: 'none',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
      onMouseEnter={(e) => {
        if (isInteractive) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(13, 148, 136, 0.38)';
          } else if (variant === 'secondary') {
            e.currentTarget.style.background = 'var(--slate-200)';
          } else if (variant === 'outline') {
            e.currentTarget.style.background = 'var(--primary-50)';
          } else if (variant === 'ghost') {
            e.currentTarget.style.background = 'var(--slate-100)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (isInteractive) {
          e.currentTarget.style.transform = 'translateY(0)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(13, 148, 136, 0.28)';
          } else if (variant === 'secondary') {
            e.currentTarget.style.background = 'var(--slate-100)';
          } else if (variant === 'outline') {
            e.currentTarget.style.background = '#ffffff';
          } else if (variant === 'ghost') {
            e.currentTarget.style.background = 'transparent';
          }
        }
      }}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};
