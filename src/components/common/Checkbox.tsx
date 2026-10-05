import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, checked, id, disabled, onChange, ...props }, ref) => {
    const checkboxId = id || `chk-${Math.random().toString(36).substring(2, 8)}`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label
          htmlFor={checkboxId}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
            fontSize: '0.875rem',
            color: 'var(--slate-700)',
            lineHeight: 1.4
          }}
        >
          <div style={{ position: 'relative', marginTop: '2px', flexShrink: 0 }}>
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
                borderRadius: '4px',
                border: `1.5px solid ${error ? 'var(--danger-solid)' : checked ? 'var(--primary-600)' : 'var(--slate-300)'}`,
                background: checked ? 'var(--primary-600)' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                boxShadow: checked ? '0 1px 3px rgba(13, 148, 136, 0.25)' : 'none'
              }}
            >
              {checked && <Check size={13} color="#ffffff" strokeWidth={3} />}
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
