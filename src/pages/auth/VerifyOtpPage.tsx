import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/common/AuthLayout';
import { OtpInput } from '../../components/auth/OtpInput';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { maskEmail } from '../../utils/validation';
import { Loader2, Edit3, Check } from 'lucide-react';

export const VerifyOtpPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(
    null
  );

  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email') || 'patient@careq.ai';
    setEmail(emailParam);
    setNewEmailInput(emailParam);

    if (params.get('reason') === 'unverified') {
      setStatusMessage({
        type: 'info',
        text: 'Please verify your email address to complete activation and access your CareQ AI portal.'
      });
    }
  }, [location.search]);

  // Countdown timer for resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otp;
    if (code.length !== 6) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter the complete 6-digit code.'
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const user = await verifyOtp(email, code);
      setStatusMessage({
        type: 'success',
        text: 'Verification successful! Redirecting to your dashboard...'
      });

      setTimeout(() => {
        if (user.role === 'doctor') {
          navigate('/doctor/dashboard', { replace: true });
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/patient/dashboard', { replace: true });
        }
      }, 700);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Invalid or expired code. Please check and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setStatusMessage(null);

    try {
      const msg = await resendOtp(email);
      setStatusMessage({
        type: 'success',
        text: msg || 'A new verification code has been sent to your email.'
      });
      setCountdown(60);
      setCanResend(false);
      setOtp('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Unable to resend code. Please try again shortly.'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSaveEmailChange = () => {
    if (newEmailInput.trim() && newEmailInput.includes('@')) {
      setEmail(newEmailInput.trim());
      setIsChangingEmail(false);
      setStatusMessage({
        type: 'info',
        text: `Verification code will now be sent to ${newEmailInput.trim()}.`
      });
    }
  };

  return (
    <AuthLayout
      title="Check your email"
      subtitle={`Please enter the 6-digit code sent to ${maskEmail(email)}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {statusMessage && (
          <Alert
            type={statusMessage.type}
            message={statusMessage.text}
            onClose={() => setStatusMessage(null)}
          />
        )}

        {/* Change Email Inline Option */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {isChangingEmail ? (
            <div style={{ display: 'flex', gap: '6px', width: '100%', maxWidth: '340px' }}>
              <input
                type="email"
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                placeholder="Enter correct email"
                autoFocus
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={handleSaveEmailChange}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  background: '#38bdf8',
                  color: '#080d1a',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Check size={14} />
                Save
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
              <span style={{ color: '#64748b' }}>Wrong email?</span>
              <button
                type="button"
                onClick={() => setIsChangingEmail(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                <Edit3 size={12} />
                <span>Edit email</span>
              </button>
            </div>
          )}
        </div>

        {/* 6-Digit OTP Box Input */}
        <div>
          <OtpInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (val.length === 6) {
                setTimeout(() => handleVerify(val), 80);
              }
            }}
            hasError={statusMessage?.type === 'error'}
            disabled={isSubmitting}
          />
        </div>

        {/* Continue Button */}
        <button
          type="button"
          disabled={otp.length !== 6 || isSubmitting}
          onClick={() => handleVerify()}
          style={{
            width: '100%',
            height: '42px',
            borderRadius: '8px',
            background: otp.length === 6 && !isSubmitting ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
            color: otp.length === 6 && !isSubmitting ? '#0b1329' : 'rgba(255, 255, 255, 0.35)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            border: 'none',
            cursor: otp.length === 6 && !isSubmitting ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
            boxShadow:
              otp.length === 6 && !isSubmitting ? '0 4px 14px rgba(255, 255, 255, 0.2)' : 'none',
            marginTop: '4px'
          }}
          onMouseEnter={(e) => {
            if (otp.length === 6 && !isSubmitting) {
              e.currentTarget.style.background = '#f1f5f9';
            }
          }}
          onMouseLeave={(e) => {
            if (otp.length === 6 && !isSubmitting) {
              e.currentTarget.style.background = '#ffffff';
            }
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>

        {/* Resend & Back link */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            marginTop: '12px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.875rem'
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Didn't receive the email?{' '}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontWeight: 600,
                  cursor: isResending ? 'not-allowed' : 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                {isResending ? 'Resending...' : 'Resend code'}
              </button>
            ) : (
              <span style={{ color: '#64748b' }}>
                Resend code in <strong style={{ color: '#94a3b8' }}>{countdown}s</strong>
              </span>
            )}
          </div>

          <Link
            to="/auth/login"
            style={{
              fontSize: '0.8125rem',
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            &larr; Back to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
