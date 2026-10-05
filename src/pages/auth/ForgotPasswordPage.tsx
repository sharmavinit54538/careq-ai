import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/common/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, Send, ExternalLink } from 'lucide-react';
import { isValidEmail } from '../../utils/validation';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ message: string; debugToken?: string } | null>(null);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Backend generates token securely and prevents enumeration
      const res = await forgotPassword(email);
      setSuccessInfo(res);
    } catch (err: any) {
      setError(err.message || 'Unable to process password reset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your registered email address and we'll send a secure password reset link."
    >
      {successInfo ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Alert
            type="success"
            title="Reset Link Dispatched"
            message={successInfo.message}
          />

          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--slate-50)',
              border: '1px solid var(--slate-200)',
              fontSize: '0.875rem',
              color: 'var(--slate-600)',
              lineHeight: 1.5
            }}
          >
            <p style={{ marginBottom: '10px' }}>
              Check your inbox for an email from <strong>security@careq.ai</strong>. The reset link is valid for 15 minutes.
            </p>

            {successInfo.debugToken && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  fontSize: '0.8125rem'
                }}
              >
                <div style={{ fontWeight: 600, color: '#0f766e', marginBottom: '6px' }}>
                  Demo Direct Reset Shortcut:
                </div>
                <Link
                  to={`/auth/reset-password?token=${successInfo.debugToken}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 700,
                    color: 'var(--primary-700)',
                    wordBreak: 'break-all'
                  }}
                >
                  <span>Open Reset Password Link</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Link
              to="/auth/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && <Alert type="error" message={error} onClose={() => setError(undefined)} />}

          <Input
            label="Registered Email Address"
            type="email"
            placeholder="e.g. sarah@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
            error={error}
            leftIcon={<Mail size={18} />}
            required
            autoComplete="email"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            leftIcon={<Send size={18} />}
          >
            Send Reset Link
          </Button>

          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <Link
              to="/auth/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--slate-600)'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
