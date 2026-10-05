import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CareQLogo } from '../components/common/CareQLogo';
import { Button } from '../components/common/Button';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogOut } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state as any) || {};
  const attemptedPath = state.attemptedPath || 'the requested route';
  const userRole = user?.role || state.userRole || 'anonymous';

  const getDashboardPath = () => {
    switch (userRole) {
      case 'doctor':
        return '/doctor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'patient':
      default:
        return '/patient/dashboard';
    }
  };

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
          maxWidth: '540px',
          width: '100%',
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          border: '1px solid var(--slate-200)',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--danger-bg)',
            color: 'var(--danger-solid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}
        >
          <ShieldAlert size={36} />
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--danger-solid)',
            background: 'var(--danger-bg)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)'
          }}
        >
          HTTP 403 Forbidden
        </span>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--slate-900)',
            marginTop: '16px',
            marginBottom: '10px'
          }}
        >
          Restricted Healthcare Area
        </h1>

        <p style={{ color: 'var(--slate-600)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '24px' }}>
          You are currently signed in as a <strong style={{ color: 'var(--primary-700)' }}>{userRole.toUpperCase()}</strong>.
          Your credentials do not possess the required medical clearance to access{' '}
          <code style={{ background: 'var(--slate-100)', padding: '2px 6px', borderRadius: '4px', color: 'var(--slate-800)' }}>
            {attemptedPath}
          </code>
          .
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate(getDashboardPath(), { replace: true })}
            leftIcon={<LayoutDashboard size={18} />}
          >
            Return to Authorized {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={async () => {
              await logout();
              navigate('/auth/login');
            }}
            leftIcon={<LogOut size={16} />}
          >
            Sign In with a Different Account
          </Button>
        </div>
      </div>
    </div>
  );
};
