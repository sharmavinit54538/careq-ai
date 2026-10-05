import React from 'react';
import { Link } from 'react-router-dom';
import { CareQLogo } from '../components/common/CareQLogo';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <CareQLogo size="lg" />
      </div>

      <div
        className="animate-fade-in"
        style={{
          maxWidth: '480px',
          width: '100%',
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          border: '1px solid var(--slate-200)',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}
      >
        <span
          style={{
            fontSize: '4rem',
            fontWeight: 800,
            color: 'var(--primary-600)',
            lineHeight: 1,
            fontFamily: 'var(--font-heading)'
          }}
        >
          404
        </span>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', margin: '16px 0 8px 0' }}>
          Page Not Found
        </h1>

        <p style={{ color: 'var(--slate-500)', fontSize: '0.9375rem', marginBottom: '24px' }}>
          The requested healthcare portal resource could not be found or has been moved.
        </p>

        <Link to="/auth/login" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" fullWidth leftIcon={<Home size={16} />}>
            Go to CareQ AI Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
};
