import React, { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, isPassword = false, type = 'text', id, required, style, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--slate-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-heading)'
            }}
          >
            <span>
              {label} {required && <span style={{ color: 'var(--danger-solid)' }}>*</span>}
            </span>
          </label>
        )}

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${error ? 'var(--danger-solid)' : isFocused ? 'var(--primary-600)' : 'var(--slate-200)'}`,
            background: disabled ? 'var(--slate-100)' : '#ffffff',
            boxShadow: isFocused
              ? error
                ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
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
                color: error ? 'var(--danger-solid)' : isFocused ? 'var(--primary-600)' : 'var(--slate-400)',
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
              padding: '10px 14px',
              paddingLeft: leftIcon ? '10px' : '14px',
              paddingRight: isPassword ? '42px' : '14px',
              fontSize: '0.9375rem',
              color: 'var(--slate-800)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              borderRadius: 'var(--radius-md)',
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
                color: 'var(--slate-400)',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--slate-700)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--slate-400)')}
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
              color: 'var(--danger-solid)',
              fontSize: '0.8125rem',
              fontWeight: 500
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <span style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
