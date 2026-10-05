import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/common/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { PasswordStrengthIndicator } from '../../components/common/PasswordStrength';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Lock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { evaluatePasswordStrength } from '../../utils/validation';

export const ResetPasswordPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenEmail, setTokenEmail] = useState<string | undefined>();
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');

    if (!tokenParam) {
      setIsValidatingToken(false);
      setIsTokenValid(false);
      return;
    }

    setToken(tokenParam);
    authService.validateResetToken(tokenParam).then((res) => {
      setIsTokenValid(res.valid);
      setTokenEmail(res.email);
      setIsValidatingToken(false);
    });
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: typeof errors = {};

    if (!newPassword) {
      newErrors.password = 'New password is required.';
    } else {
      const strength = evaluatePasswordStrength(newPassword);
      if (strength.score < 2) {
        newErrors.password = 'Password must meet clinical security standards.';
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your new password.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      navigate('/auth/login?reset=success', { replace: true });
    } catch (err: any) {
      setErrors({
        general: err.message || 'Failed to reset password. The link may have expired.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidatingToken) {
    return (
      <AuthLayout title="Reset Password" subtitle="Validating your security reset token...">
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--slate-500)' }}>
          Checking link validity...
        </div>
      </AuthLayout>
    );
  }

  if (!isTokenValid) {
    return (
      <AuthLayout title="Invalid or Expired Link" subtitle="Security token validation failed">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Alert
            type="error"
            title="Link Expired or Invalid"
            message="This password reset link is invalid or has already been used. For your security, reset links are single-use and expire within 15 minutes."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/auth/forgot-password" style={{ textDecoration: 'none' }}>
              <Button variant="primary" fullWidth>
                Request a New Reset Link
              </Button>
            </Link>

            <Link
              to="/auth/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--slate-600)',
                padding: '8px'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle={`Set a strong, new password for ${tokenEmail || 'your account'}`}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {errors.general && (
          <Alert
            type="error"
            message={errors.general}
            onClose={() => setErrors((prev) => ({ ...prev, general: undefined }))}
          />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Input
            label="New Password"
            isPassword
            name="newPassword"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            leftIcon={<Lock size={18} />}
            required
            autoComplete="new-password"
          />
          <PasswordStrengthIndicator password={newPassword} />
        </div>

        <Input
          label="Confirm New Password"
          isPassword
          name="confirmPassword"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          error={errors.confirmPassword}
          leftIcon={<Lock size={18} />}
          required
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<CheckCircle2 size={18} />}
        >
          Update Password
        </Button>

        <div style={{ textAlign: 'center', marginTop: '6px' }}>
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
            <span>Cancel and Return to Sign In</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
