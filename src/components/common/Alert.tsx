import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: React.ReactNode;
  onClose?: () => void;
  action?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  action
}) => {
  const configs = {
    error: {
      bg: 'var(--danger-bg)',
      border: 'var(--danger-border)',
      color: 'var(--danger-text)',
      icon: <AlertCircle size={20} color="var(--danger-solid)" style={{ flexShrink: 0 }} />
    },
    success: {
      bg: 'var(--success-bg)',
      border: 'var(--success-border)',
      color: 'var(--success-text)',
      icon: <CheckCircle2 size={20} color="var(--success-solid)" style={{ flexShrink: 0 }} />
    },
    warning: {
      bg: 'var(--warning-bg)',
      border: 'var(--warning-border)',
      color: 'var(--warning-text)',
      icon: <AlertTriangle size={20} color="var(--warning-solid)" style={{ flexShrink: 0 }} />
    },
    info: {
      bg: 'var(--info-bg)',
      border: 'var(--info-border)',
      color: 'var(--info-text)',
      icon: <Info size={20} color="var(--info-solid)" style={{ flexShrink: 0 }} />
    }
  };

  const current = configs[type];

  return (
    <div
      role="alert"
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: current.color,
        fontSize: '0.875rem',
        lineHeight: 1.45,
        position: 'relative'
      }}
    >
      <div style={{ marginTop: '1px' }}>{current.icon}</div>
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontWeight: 700, marginBottom: '2px', fontFamily: 'var(--font-heading)' }}>
            {title}
          </div>
        )}
        <div>{message}</div>
        {action && <div style={{ marginTop: '8px' }}>{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          style={{
            padding: '2px',
            color: 'inherit',
            opacity: 0.7,
            borderRadius: '4px',
            display: 'flex'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
