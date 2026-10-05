import React, { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  dark?: boolean;
  labelRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      isPassword = false,
      dark = false,
      labelRight,
      type = 'text',
      id,
      required,
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', width: '100%' }}>
        {label && (
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: dark ? '#ffffff' : 'var(--slate-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-heading)'
            }}
          >
            <label htmlFor={inputId} style={{ cursor: 'pointer' }}>
              {label} {required && <span style={{ color: dark ? '#f87171' : 'var(--danger-solid)' }}>*</span>}
            </label>
            {labelRight && <div>{labelRight}</div>}
          </div>
        )}

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            border: `1px solid ${
              error
                ? dark
                  ? '#f87171'
                  : 'var(--danger-solid)'
                : isFocused
                ? '#38bdf8'
                : dark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'var(--slate-200)'
            }`,
            background: disabled
              ? dark
                ? 'rgba(255, 255, 255, 0.04)'
                : 'var(--slate-100)'
              : dark
              ? '#172138'
              : '#ffffff',
            boxShadow: isFocused
              ? error
                ? '0 0 0 3px rgba(239, 68, 68, 0.2)'
                : dark
                ? '0 0 0 3px rgba(56, 189, 248, 0.2)'
                : '0 0 0 3px rgba(13, 148, 136, 0.15)'
              : 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
          }}
        >
          {leftIcon && (
            <div
              style={{
                paddingLeft: '12px',
                display: 'flex',
                alignItems: 'center',
                color: error
                  ? dark
                    ? '#f87171'
                    : 'var(--danger-solid)'
                  : isFocused
                  ? '#38bdf8'
                  : dark
                  ? '#94a3b8'
                  : 'var(--slate-400)',
                pointerEvents: 'none'
              }}
            >
              {leftIcon}
            </div>
          )}

          <input
            {...props}
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            required={required}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            style={{
              flex: 1,
              width: '100%',
              padding: '11px 14px',
              paddingLeft: leftIcon ? '10px' : '14px',
              paddingRight: isPassword ? '42px' : '14px',
              fontSize: '0.9375rem',
              color: dark ? '#ffffff' : 'var(--slate-800)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              borderRadius: '8px',
              fontFamily: 'inherit',
              ...style
            }}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: dark ? '#94a3b8' : 'var(--slate-400)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = dark ? '#ffffff' : 'var(--slate-700)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = dark ? '#94a3b8' : 'var(--slate-400)')}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: dark ? '#f87171' : 'var(--danger-solid)',
              fontSize: '0.8125rem',
              fontWeight: 500
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <span style={{ fontSize: '0.8125rem', color: dark ? '#94a3b8' : 'var(--slate-500)' }}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
