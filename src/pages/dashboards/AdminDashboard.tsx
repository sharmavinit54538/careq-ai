import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import type { User, DoctorVerificationStatus } from '../../types/auth';
import { CareQLogo } from '../../components/common/CareQLogo';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import {
  ShieldAlert,
  Stethoscope,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  FileText,
  RefreshCw,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout, resetDatabase } = useAuth();
  const [doctorsList, setDoctorsList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const docs = await authService.adminGetDoctorsList();
      setDoctorsList(docs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleUpdateStatus = async (
    doctorId: string,
    status: DoctorVerificationStatus,
    reason?: string
  ) => {
    try {
      await authService.adminUpdateDoctorStatus(doctorId, status, reason);
      setActionSuccess(`Doctor status updated to ${status.toUpperCase()} successfully.`);
      await loadDoctors();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update doctor verification status.');
    }
  };

  const pendingDoctors = doctorsList.filter((d) => d.doctorProfile?.verificationStatus === 'pending');
  const approvedDoctors = doctorsList.filter((d) => d.doctorProfile?.verificationStatus === 'approved');

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Top Header */}
      <header
        style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <CareQLogo size="md" light />
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            System Administration
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            <ShieldCheck size={14} />
            MFA 2-Factor Active
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=ef4444&color=fff`
              }
              alt={user?.name}
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ffffff' }}>
                {user?.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>CareQ Compliance Officer</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            style={{ color: '#cbd5e1' }}
            leftIcon={<LogOut size={16} />}
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>
        {actionSuccess && (
          <div style={{ marginBottom: '20px' }}>
            <Alert type="success" title="Action Completed" message={actionSuccess} />
          </div>
        )}

        {/* Admin Overview Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              border: '1px solid var(--slate-200)',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                PENDING VERIFICATIONS
              </span>
              <Clock size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>
              {pendingDoctors.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              Physicians awaiting credential audit
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              border: '1px solid var(--slate-200)',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                ACTIVE LICENSED PHYSICIANS
              </span>
              <Stethoscope size={18} color="#0d9488" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0d9488' }}>
              {approvedDoctors.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              Approved with full telehealth privileges
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              border: '1px solid var(--slate-200)',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                AUTHENTICATION SECURITY
              </span>
              <ShieldAlert size={18} color="#0284c7" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>
              100%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              HIPAA &amp; Token Rotation Enforced
            </div>
          </div>
        </div>

        {/* Doctor Verification Queue Header */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--slate-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Physician Credentialing &amp; Verification Board
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                Review medical registrations, license documents, and authorize doctor clinical privileges.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant={activeTab === 'pending' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('pending')}
              >
                Pending Audits ({pendingDoctors.length})
              </Button>
              <Button
                variant={activeTab === 'all' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('all')}
              >
                All Doctors ({doctorsList.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadDoctors}
                title="Refresh List"
                leftIcon={<RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Doctors List */}
          <div style={{ padding: '24px' }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-500)' }}>
                Loading physician records...
              </div>
            ) : (activeTab === 'pending' ? pendingDoctors : doctorsList).length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  background: 'var(--slate-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--slate-300)'
                }}
              >
                <CheckCircle size={36} color="var(--success-solid)" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '6px' }}>
                  No pending doctor audits in queue
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                  All physician applications have been reviewed and processed.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {(activeTab === 'pending' ? pendingDoctors : doctorsList).map((doctor) => {
                  const p = doctor.doctorProfile;
                  const isDoctorPending = p?.verificationStatus === 'pending';

                  return (
                    <div
                      key={doctor.id}
                      style={{
                        padding: '20px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isDoctorPending ? '#fde68a' : 'var(--slate-200)'}`,
                        background: isDoctorPending ? '#fffdf7' : '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                    >
                      {/* Doctor Overview Line */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={
                              doctor.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0284c7&color=fff`
                            }
                            alt={doctor.name}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800 }}>{doctor.name}</h3>
                              <span
                                style={{
                                  fontSize: '0.6875rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  background:
                                    p?.verificationStatus === 'approved'
                                      ? '#ecfdf5'
                                      : p?.verificationStatus === 'pending'
                                      ? '#fef3c7'
                                      : '#fee2e2',
                                  color:
                                    p?.verificationStatus === 'approved'
                                      ? '#065f46'
                                      : p?.verificationStatus === 'pending'
                                      ? '#92400e'
                                      : '#991b1b'
                                }}
                              >
                                {p?.verificationStatus}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                              {doctor.email} &bull; {doctor.phone}
                            </div>
                          </div>
                        </div>

                        {/* Status Actions */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {p?.verificationStatus !== 'approved' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleUpdateStatus(doctor.id, 'approved')}
                              leftIcon={<CheckCircle size={15} />}
                            >
                              Approve Credentials
                            </Button>
                          )}

                          {p?.verificationStatus !== 'rejected' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                const reason = prompt('Enter rejection reason (optional):');
                                handleUpdateStatus(doctor.id, 'rejected', reason || undefined);
                              }}
                              leftIcon={<XCircle size={15} color="var(--danger-solid)" />}
                            >
                              Reject
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Doctor Clinical Credentials Details Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '12px',
                          background: 'var(--slate-50)',
                          padding: '14px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8125rem'
                        }}
                      >
                        <div>
                          <div style={{ color: 'var(--slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                            Specialization
                          </div>
                          <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{p?.specialization}</div>
                        </div>

                        <div>
                          <div style={{ color: 'var(--slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                            Qualification
                          </div>
                          <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{p?.qualification}</div>
                        </div>

                        <div>
                          <div style={{ color: 'var(--slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                            Medical Reg No.
                          </div>
                          <div style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{p?.medicalRegNo}</div>
                        </div>

                        <div>
                          <div style={{ color: 'var(--slate-400)', textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                            Hospital Affiliation
                          </div>
                          <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{p?.hospitalName}</div>
                        </div>
                      </div>

                      {/* Submitted Verification Documents */}
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '8px' }}>
                          ATTACHED DOCUMENTS:
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {p?.documents?.map((doc) => (
                            <div
                              key={doc.id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-sm)',
                                background: '#ffffff',
                                border: '1px solid var(--slate-300)',
                                fontSize: '0.75rem',
                                color: 'var(--slate-700)'
                              }}
                            >
                              <FileText size={14} color="var(--primary-600)" />
                              <span>{doc.name}</span>
                              <span style={{ color: 'var(--slate-400)' }}>({doc.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Demo Utility Reset */}
        <div
          style={{
            marginTop: '32px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Need to reset test accounts and audit records?
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Reset demo database to original seed state?')) {
                resetDatabase();
                window.location.reload();
              }
            }}
            leftIcon={<RotateCcw size={14} />}
          >
            Reset Demo DB
          </Button>
        </div>
      </main>
    </div>
  );
};
