import React from 'react';
import { CareQLogo } from './CareQLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  maxWidth?: string | number;
  footerContent?: React.ReactNode;
  showLogo?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  maxWidth = '460px',
  footerContent,
  showLogo = false
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: '#080d1a',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(13, 148, 136, 0.05) 45%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Brand Header (Optional) */}
      {showLogo && (
        <div style={{ marginBottom: '24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <CareQLogo size="md" light showTagline={false} />
        </div>
      )}

      {/* Main Dark Auth Card */}
      <div
        className="animate-fade-in auth-card"
        style={{
          width: '100%',
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          background: '#0b1329',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.03)',
          padding: '36px 32px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Form Title & Subtitle */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '1.625rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '6px'
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.9375rem', color: '#94a3b8', lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Dynamic Form Content */}
        <div>{children}</div>
      </div>

      {/* Optional Outer Footer Content */}
      {footerContent && (
        <div
          style={{
            marginTop: '22px',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#94a3b8',
            position: 'relative',
            zIndex: 1
          }}
        >
          {footerContent}
        </div>
      )}

      <style>{`
        @media (max-width: 520px) {
          .auth-card {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};
