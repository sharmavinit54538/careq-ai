import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../components/common/AuthLayout';
import { Input } from '../../components/common/Input';
import { Checkbox } from '../../components/common/Checkbox';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { Loader2, UserPlus, Stethoscope } from 'lucide-react';
import { isValidEmail } from '../../utils/validation';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect');
  const verifiedNotice = queryParams.get('verified');
  const resetNotice = queryParams.get('reset');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validations
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const authenticatedUser = await login(email, password, rememberMe);

      if (redirectPath && !redirectPath.startsWith('/auth')) {
        navigate(redirectPath, { replace: true });
        return;
      }

      switch (authenticatedUser.role) {
        case 'doctor':
          navigate('/doctor/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'patient':
        default:
          navigate('/patient/dashboard', { replace: true });
          break;
      }
    } catch (err: any) {
      if (err.requiresVerification) {
        navigate(`/auth/verify?email=${encodeURIComponent(err.email || email)}&reason=unverified`);
      } else {
        setErrors({
          general: err.message || 'Authentication failed. Please check your credentials and try again.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your CareQ AI account"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {verifiedNotice && (
          <Alert
            type="success"
            title="Account Verified"
            message="Your email has been successfully verified! Please sign in with your password."
          />
        )}

        {resetNotice && (
          <Alert
            type="success"
            title="Password Updated"
            message="Your password was reset successfully. Sign in with your new credentials."
          />
        )}

        {errors.general && (
          <Alert
            type="error"
            title="Sign In Error"
            message={errors.general}
            onClose={() => setErrors((prev) => ({ ...prev, general: undefined }))}
          />
        )}

        <Input
          label="Email address"
          type="email"
          name="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          dark
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          isPassword
          name="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          dark
          required
          autoComplete="current-password"
          labelRight={
            <Link
              to="/auth/forgot-password"
              style={{
                fontSize: '0.8125rem',
                color: '#94a3b8',
                textDecoration: 'none',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              Forgot password
            </Link>
          }
        />

        {/* Remember Me Checkbox */}
        <div style={{ marginTop: '2px', marginBottom: '4px' }}>
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label="Remember me on this device"
            dark
            round
          />
        </div>

        {/* Sign in Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            height: '42px',
            borderRadius: '8px',
            background: isSubmitting ? '#94a3b8' : '#e2e8f0',
            color: '#0b1329',
            fontSize: '0.9375rem',
            fontWeight: 700,
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            marginTop: '6px'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 255, 255, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
            }
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>
      </form>

      {/* Divider & Registration Options inside Card */}
      <div style={{ marginTop: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
            gap: '12px'
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          <span
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 600
            }}
          >
            Don't have an account?
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px'
          }}
        >
          <Link
            to="/auth/register/patient"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#e2e8f0',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <UserPlus size={15} style={{ color: '#2dd4bf' }} />
            <span>Register Patient</span>
          </Link>

          <Link
            to="/auth/register/doctor"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Stethoscope size={15} style={{ color: '#38bdf8' }} />
            <span>Doctor Portal</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
