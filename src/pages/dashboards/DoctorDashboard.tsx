import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CareQLogo } from '../../components/common/CareQLogo';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import {
  Stethoscope,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lock,
  LogOut,
  FileText,
  Users,
  Calendar,
  Video,
  Award,
  ShieldCheck,
  RotateCw
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const doctorProfile = user?.doctorProfile;
  const status = doctorProfile?.verificationStatus || 'pending';
  const isApproved = status === 'approved';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUser();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
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
              background: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            Physician Portal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            leftIcon={<RotateCw size={14} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Refresh Status
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Doctor')}&background=0284c7&color=fff`
              }
              alt={user?.name}
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-800)' }}>
                {user?.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {doctorProfile?.specialization || 'Licensed Physician'}
              </span>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => logout()} leftIcon={<LogOut size={16} />}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>
        {/* Verification Status Alert Banner */}
        {!isApproved && (
          <div style={{ marginBottom: '24px' }}>
            {status === 'pending' ? (
              <div
                style={{
                  padding: '18px 22px',
                  borderRadius: 'var(--radius-lg)',
                  background: '#fffbeb',
                  border: '1.5px solid #fde68a',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
              >
                <Clock size={24} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#92400e', marginBottom: '4px' }}>
                    Doctor Account Pending Credential Verification
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#b45309', lineHeight: 1.5, marginBottom: '10px' }}>
                    Your state medical registration (<strong>{doctorProfile?.medicalRegNo}</strong>) and uploaded verification
                    documents are currently being audited by the CareQ AI medical governance board. Telehealth consultations and
                    e-prescriptions remain locked until administrative approval.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#78350f' }}>
                    <span>Estimated turnaround: 2 to 4 business hours</span>
                    &bull;
                    <span style={{ color: '#0d9488', fontWeight: 600 }}>
                      Tip: You can log into the Admin account (admin@careq.ai) to approve this application instantly!
                    </span>
                  </div>
                </div>
              </div>
            ) : status === 'rejected' ? (
              <Alert
                type="error"
                title="Credential Verification Rejected"
                message={
                  doctorProfile?.rejectionReason ||
                  'The submitted medical documentation could not be verified with the state board. Please contact compliance@careq.ai.'
                }
              />
            ) : null}
          </div>
        )}

        {/* Doctor Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: isApproved ? 'rgba(52, 211, 153, 0.25)' : 'rgba(251, 191, 36, 0.25)',
                  color: isApproved ? '#34d399' : '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: isApproved ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(251, 191, 36, 0.4)'
                }}
              >
                {isApproved ? <CheckCircle size={14} /> : <Clock size={14} />}
                Verification Status: {status.toUpperCase()}
              </span>

              <span style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>
                Reg: {doctorProfile?.medicalRegNo}
              </span>
            </div>

            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              {user?.name}
            </h1>
            <p style={{ color: '#e0f2fe', fontSize: '0.9375rem' }}>
              {doctorProfile?.qualification} &bull; {doctorProfile?.specialization} &bull; {doctorProfile?.hospitalName}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outline"
              size="md"
              disabled={!isApproved}
              style={{
                background: isApproved ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                color: isApproved ? '#0369a1' : '#94a3b8',
                border: 'none',
                cursor: isApproved ? 'pointer' : 'not-allowed'
              }}
              leftIcon={isApproved ? <Video size={16} /> : <Lock size={16} />}
            >
              {isApproved ? 'Start Consultation Room' : 'Consultations Locked'}
            </Button>
            <Button
              variant="secondary"
              size="md"
              disabled={!isApproved}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: isApproved ? 'pointer' : 'not-allowed'
              }}
              leftIcon={isApproved ? <FileText size={16} /> : <Lock size={16} />}
            >
              Issue Prescription
            </Button>
          </div>
        </div>

        {/* Doctor Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Consultation Features & Patient Queue */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                border: '1px solid var(--slate-200)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '16px' }}>
                Today's Scheduled Consultations
              </h3>

              {!isApproved ? (
                <div
                  style={{
                    padding: '32px 20px',
                    textAlign: 'center',
                    background: 'var(--slate-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--slate-300)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Lock size={32} color="var(--slate-400)" />
                  <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
                    Patient Consultation Queue is Disabled
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', maxWidth: '420px' }}>
                    As required by healthcare compliance regulations, your clinical license must be verified
                    before accepting patient appointments.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--slate-50)',
                      border: '1px solid var(--slate-200)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Sarah Jenkins (Follow-up)</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                        10:30 AM &bull; Hypertension &amp; Vitals Review &bull; AI Triage: Low Risk
                      </div>
                    </div>
                    <Button variant="primary" size="sm" leftIcon={<Video size={14} />}>
                      Join Video Call
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Uploaded Verification Documents Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                border: '1px solid var(--slate-200)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '16px' }}>
                Submitted Verification Documents
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {doctorProfile?.documents && doctorProfile.documents.length > 0 ? (
                  doctorProfile.documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--slate-50)',
                        border: '1px solid var(--slate-200)',
                        fontSize: '0.875rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FileText size={20} color="var(--primary-600)" />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{doc.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                            {doc.size} &bull; Uploaded {doc.uploadedAt}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: doc.verified ? '#ecfdf5' : '#fffbeb',
                          color: doc.verified ? '#065f46' : '#92400e',
                          border: doc.verified ? '1px solid #a7f3d0' : '1px solid #fde68a'
                        }}
                      >
                        {doc.verified ? 'Verified' : 'Pending Audit'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                    No documents on record.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Credential Profile Details */}
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
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '16px' }}>
                Board Registration Record
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Medical Reg No.</span>
                  <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{doctorProfile?.medicalRegNo}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Clinical Experience</span>
                  <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{doctorProfile?.experienceYears} Years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Primary Hospital</span>
                  <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{doctorProfile?.hospitalName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Email Verified</span>
                  <span style={{ fontWeight: 700, color: 'var(--success-solid)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
