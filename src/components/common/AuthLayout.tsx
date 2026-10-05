import React, { useState } from 'react';
import { CareQLogo } from './CareQLogo';
import { ShieldCheck, Activity, Brain, Users, Sparkles, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (email: string) => {
    try {
      const user = await login(email, 'Password@123', true);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    } catch (err: any) {
      if (err.requiresVerification) {
        navigate(`/auth/verify?email=${encodeURIComponent(email)}`);
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f8fafc',
        color: 'var(--slate-800)'
      }}
    >
      {/* Top Demo Bar for Reviewers & Testers */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          fontSize: '0.8125rem',
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 50
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(13, 148, 136, 0.3)',
                color: '#2dd4bf',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            >
              <Sparkles size={12} />
              Production Demo
            </span>
            <span style={{ color: '#cbd5e1' }}>
              CareQ AI Unified Authentication with 3 Roles (Patient, Doctor, Admin)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              fontWeight: 600,
              fontSize: '0.75rem',
              padding: '4px 8px',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.1)'
            }}
          >
            <span>{showDemoCredentials ? 'Hide Demo Logins' : '1-Click Quick Demo Accounts'}</span>
            {showDemoCredentials ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Collapsible Demo Accounts Selector */}
        {showDemoCredentials && (
          <div
            className="animate-fade-in"
            style={{
              maxWidth: '1200px',
              width: '100%',
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '8px'
            }}
          >
            <button
              onClick={() => handleQuickLogin('patient@careq.ai')}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                textAlign: 'left',
                color: '#ffffff'
              }}
            >
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.8125rem' }}>
                👤 Patient (Active / Verified)
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>patient@careq.ai &bull; Password@123</div>
            </button>

            <button
              onClick={() => handleQuickLogin('doctor@careq.ai')}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                textAlign: 'left',
                color: '#ffffff'
              }}
            >
              <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.8125rem' }}>
                🩺 Doctor (Approved / Active)
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>doctor@careq.ai &bull; Password@123</div>
            </button>

            <button
              onClick={() => handleQuickLogin('pending.doctor@careq.ai')}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                textAlign: 'left',
                color: '#ffffff'
              }}
            >
              <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.8125rem' }}>
                ⏳ Doctor (Pending Verification)
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>pending.doctor@careq.ai &bull; Password@123</div>
            </button>

            <button
              onClick={() => handleQuickLogin('admin@careq.ai')}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                textAlign: 'left',
                color: '#ffffff'
              }}
            >
              <div style={{ fontWeight: 700, color: '#f43f5e', fontSize: '0.8125rem' }}>
                🛡️ Administrator (Full Control)
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>admin@careq.ai &bull; Password@123</div>
            </button>
          </div>
        )}
      </div>

      {/* Main Split Layout */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.25fr)',
          minHeight: 'calc(100vh - 45px)'
        }}
        className="auth-layout-grid"
      >
        {/* Left Branding & AI Visual Showcase */}
        <div
          className="auth-branding-panel"
          style={{
            background: 'linear-gradient(155deg, #091e3a 0%, #06182c 50%, #041220 100%)',
            color: '#ffffff',
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Background Glows */}
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              right: '-10%',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(13, 148, 136, 0.28) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-10%',
              left: '-10%',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}
          />

          {/* Header Branding */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <CareQLogo size="lg" light showTagline />
          </div>

          {/* Center Showcase: Intelligent Healthcare Platform */}
          <div style={{ position: 'relative', zIndex: 1, margin: '48px 0' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(13, 148, 136, 0.18)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                color: '#2dd4bf',
                fontSize: '0.8125rem',
                fontWeight: 600,
                marginBottom: '20px'
              }}
            >
              <Activity size={15} />
              AI Clinical Intelligence Ecosystem
            </div>

            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '16px'
              }}
            >
              Smarter Healthcare. <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #2dd4bf 0%, #38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Better Care.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.0625rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
                maxWidth: '480px',
                marginBottom: '32px'
              }}
            >
              CareQ AI connects patients, verified medical professionals, and clinical administrators
              with real-time AI-assisted diagnostics, unified scheduling, and continuous medical record telemetry.
            </p>

            {/* Feature Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(13, 148, 136, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2dd4bf',
                    marginBottom: '10px'
                  }}
                >
                  <Brain size={20} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '4px' }}>
                  AI Clinical Insights
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Real-time symptom triage and diagnostic assistance for physicians.
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    marginBottom: '10px'
                  }}
                >
                  <Users size={20} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '4px' }}>
                  Unified Roles
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Tailored dashboards for patients, licensed doctors, and admins.
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Badges */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              fontSize: '0.75rem',
              color: '#94a3b8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#34d399" />
              <span>HIPAA Compliant &amp; SOC 2 Type II</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} color="#38bdf8" />
              <span>End-to-End Encrypted Telehealth</span>
            </div>
          </div>
        </div>

        {/* Right Form Card Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 24px',
            background: '#ffffff'
          }}
        >
          {/* Mobile Top Brand (only shows on smaller viewports) */}
          <div className="mobile-brand-header" style={{ marginBottom: '28px', display: 'none' }}>
            <CareQLogo size="md" showTagline />
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Form Title & Subtitle */}
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--slate-900)',
                  letterSpacing: '-0.025em',
                  marginBottom: '8px'
                }}
              >
                {title}
              </h2>
              {subtitle && (
                <p style={{ fontSize: '0.9375rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Dynamic Form Content */}
            <div className="animate-fade-in">{children}</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .auth-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .auth-branding-panel {
            display: none !important;
          }
          .mobile-brand-header {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
