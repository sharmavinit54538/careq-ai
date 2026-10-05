import React, { type InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  error?: string;
  dark?: boolean;
  round?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, checked, dark = false, round = false, id, disabled, onChange, ...props }, ref) => {
    const checkboxId = id || `chk-${Math.random().toString(36).substring(2, 8)}`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label
          htmlFor={checkboxId}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
            fontSize: '0.875rem',
            color: dark ? '#cbd5e1' : 'var(--slate-700)',
            lineHeight: 1.4
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <input
              {...props}
              ref={ref}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={onChange}
              style={{
                position: 'absolute',
                opacity: 0,
                width: 0,
                height: 0
              }}
            />
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: round ? '50%' : '4px',
                border: `1.5px solid ${
                  error
                    ? 'var(--danger-solid)'
                    : checked
                    ? dark
                      ? '#38bdf8'
                      : 'var(--primary-600)'
                    : dark
                    ? 'rgba(255, 255, 255, 0.35)'
                    : 'var(--slate-300)'
                }`,
                background: checked
                  ? dark
                    ? '#38bdf8'
                    : 'var(--primary-600)'
                  : dark
                  ? 'transparent'
                  : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              {checked && (
                round ? (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0b1329' }} />
                ) : (
                  <Check size={13} color="#ffffff" strokeWidth={3} />
                )
              )}
            </div>
          </div>
          <div>{label}</div>
        </label>
        {error && (
          <span style={{ fontSize: '0.75rem', color: 'var(--danger-solid)', paddingLeft: '28px' }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
