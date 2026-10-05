import React from 'react';
import { CareQLogo } from './CareQLogo';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  message = 'Authenticating with CareQ AI...'
}) => {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '32px'
      }}
    >
      <CareQLogo size="md" clickable={false} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--slate-600)' }}>
        <Loader2 size={20} className="animate-spin" color="var(--primary-600)" />
        <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{message}</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};
