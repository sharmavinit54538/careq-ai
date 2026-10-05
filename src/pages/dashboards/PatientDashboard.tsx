import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CareQLogo } from '../../components/common/CareQLogo';
import { Button } from '../../components/common/Button';
import {
  Calendar,
  Bot,
  LogOut,
  UserCheck,
  Video,
  Shield
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--slate-200)',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <CareQLogo size="md" />
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            Patient Portal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Patient')}&background=0d9488&color=fff`
              }
              alt={user?.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-800)' }}>
                {user?.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{user?.email}</span>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => logout()} leftIcon={<LogOut size={16} />}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Patient Content */}
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>
        {/* Welcome Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #091e3a 0%, #0d9488 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 36px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '32px'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.15)',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '12px'
              }}
            >
              <Bot size={14} />
              AI Clinical Health Companion Active
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Welcome back, {user?.name}
            </h1>
            <p style={{ color: '#e0f2fe', fontSize: '0.9375rem', maxWidth: '520px' }}>
              Your vitals and care plan are synced. You have 1 upcoming consultation scheduled with Dr. Evelyn Reed.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outline"
              size="md"
              style={{ background: '#ffffff', color: '#0f766e', border: 'none' }}
              leftIcon={<Video size={16} />}
            >
              Join Telehealth Room
            </Button>
            <Button
              variant="secondary"
              size="md"
              style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}
              leftIcon={<Calendar size={16} />}
            >
              Book New Visit
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column: Appointments & Records */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Upcoming Appointments Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                border: '1px solid var(--slate-200)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Upcoming Consultations</h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--primary-600)', fontWeight: 600, cursor: 'pointer' }}>
                  View All
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(13, 148, 136, 0.15)',
                      color: 'var(--primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Video size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                      Dr. Evelyn Reed (Cardiology Follow-up)
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                      Tomorrow at 10:30 AM &bull; High-Definition Encrypted Video
                    </div>
                  </div>
                </div>

                <Button variant="primary" size="sm" leftIcon={<Video size={14} />}>
                  Ready to Join
                </Button>
              </div>
            </div>

            {/* AI Health Insights */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                border: '1px solid var(--slate-200)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Bot size={22} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>AI Health Summary</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '16px' }}>
                Based on your logged blood pressure readings over the last 14 days, your cardiovascular markers
                are within optimal target range (118/76 mmHg). No medication dosage adjustment is recommended.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-100)',
                  color: 'var(--primary-900)',
                  fontSize: '0.8125rem'
                }}
              >
                <Shield size={18} color="var(--primary-600)" style={{ flexShrink: 0 }} />
                <span>All health telemetry analyzed by CareQ AI is HIPAA-compliant and reviewed by licensed physicians.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Profile & Medical Vitals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                border: '1px solid var(--slate-200)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '16px' }}>Patient Vitals Profile</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Blood Group</span>
                  <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{user?.patientProfile?.bloodGroup || 'O+'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Known Allergies</span>
                  <span style={{ fontWeight: 600, color: 'var(--danger-solid)' }}>
                    {user?.patientProfile?.allergies?.join(', ') || 'Penicillin'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Verified Phone</span>
                  <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{user?.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Email Status</span>
                  <span style={{ fontWeight: 700, color: 'var(--success-solid)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <UserCheck size={14} /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                border: '1px solid var(--primary-200)'
              }}
            >
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '8px' }}>
                Need Immediate Medical Triage?
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--primary-800)', lineHeight: 1.5, marginBottom: '14px' }}>
                Chat with CareQ AI for symptom pre-assessment or connect with on-call urgent care.
              </p>
              <Button variant="primary" size="sm" fullWidth leftIcon={<Bot size={14} />}>
                Start AI Triage Session
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
