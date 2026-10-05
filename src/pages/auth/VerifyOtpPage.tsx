import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/common/AuthLayout';
import { OtpInput } from '../../components/auth/OtpInput';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { maskEmail } from '../../utils/validation';
import { CheckCircle2, RotateCw, Edit3, ShieldAlert, ArrowRight } from 'lucide-react';

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
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter the complete 6-digit verification code.'
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const user = await verifyOtp(email, otp);
      setStatusMessage({
        type: 'success',
        text: 'Verification successful! Redirecting to your secure dashboard...'
      });

      setTimeout(() => {
        if (user.role === 'doctor') {
          navigate('/doctor/dashboard', { replace: true });
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/patient/dashboard', { replace: true });
        }
      }, 800);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Invalid or expired verification code. Please check and try again.'
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
        text: msg || 'A fresh verification code has been dispatched.'
      });
      setCountdown(60);
      setCanResend(false);
      setOtp('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Unable to resend verification code. Please try again shortly.'
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
        text: `Verification code will now be sent to ${newEmailInput.trim()}. Demo code: 123456`
      });
    }
  };

  return (
    <AuthLayout
      title="Verify your account"
      subtitle="Enter the 6-digit security code sent to your registered address"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {statusMessage && (
          <Alert
            type={statusMessage.type}
            message={statusMessage.text}
            onClose={() => setStatusMessage(null)}
          />
        )}

        {/* Email Masked Header & Change Email Option */}
        <div
          style={{
            background: 'var(--slate-50)',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {isChangingEmail ? (
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <input
                type="email"
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--primary-600)',
                  fontSize: '0.875rem'
                }}
              />
              <Button size="sm" variant="primary" onClick={handleSaveEmailChange}>
                Save
              </Button>
            </div>
          ) : (
            <>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Verification Code Sent To
                </div>
                <div style={{ fontWeight: 700, color: 'var(--slate-900)', fontSize: '0.9375rem' }}>
                  {maskEmail(email)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChangingEmail(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8125rem',
                  color: 'var(--primary-600)',
                  fontWeight: 600
                }}
              >
                <Edit3 size={14} />
                <span>Change</span>
              </button>
            </>
          )}
        </div>

        {/* 6-Digit OTP Box Input */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)', textAlign: 'center', display: 'block' }}>
            6-Digit Verification Code
          </label>
          <OtpInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (val.length === 6) {
                // Auto trigger when 6 digits are typed
                setTimeout(() => handleVerify(), 100);
              }
            }}
            hasError={statusMessage?.type === 'error'}
            disabled={isSubmitting}
          />
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Demo bypass code: <strong style={{ color: 'var(--primary-700)' }}>123456</strong>
          </div>
        </div>

        {/* Verify Button */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          disabled={otp.length !== 6}
          onClick={() => handleVerify()}
          leftIcon={<CheckCircle2 size={18} />}
        >
          Verify &amp; Continue
        </Button>

        {/* Resend & Timer */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '12px',
            borderTop: '1px solid var(--slate-200)',
            fontSize: '0.875rem'
          }}
        >
          <div style={{ color: 'var(--slate-600)' }}>
            Didn't receive the email code?
          </div>

          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--primary-600)',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              <RotateCw size={14} className={isResending ? 'animate-spin' : ''} />
              <span>Resend Verification Code</span>
            </button>
          ) : (
            <span style={{ color: 'var(--slate-400)', fontSize: '0.8125rem' }}>
              Resend available in <strong style={{ color: 'var(--slate-700)' }}>{countdown}s</strong>
            </span>
          )}

          <Link
            to="/auth/login"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--slate-500)',
              marginTop: '6px'
            }}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
