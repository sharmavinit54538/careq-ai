import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../components/common/AuthLayout';
import { Input } from '../../components/common/Input';
import { Checkbox } from '../../components/common/Checkbox';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
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
      newErrors.email = 'Work email is required.';
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
      subtitle="Sign in to your CareQ AI workspace"
      footerContent={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.875rem'
          }}
        >
          <span style={{ color: '#94a3b8' }}>New to CareQ AI?</span>
          <Link
            to="/auth/register/patient"
            style={{
              color: '#ffffff',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
          >
            Create a workspace
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.25)', margin: '0 4px' }}>&bull;</span>
          <Link
            to="/auth/register/doctor"
            style={{
              color: '#38bdf8',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.8125rem'
            }}
          >
            Doctor Portal
          </Link>
        </div>
      }
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
          label="Work email"
          type="email"
          name="email"
          placeholder="sharmavinit7348@gmail.com"
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
              Forgot password?
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
    </AuthLayout>
  );
};
