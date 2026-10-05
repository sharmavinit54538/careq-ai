import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../components/common/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Checkbox } from '../../components/common/Checkbox';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, UserPlus, Stethoscope } from 'lucide-react';
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
      // Backend validates credentials and returns authenticated user with server-assigned role
      const authenticatedUser = await login(email, password, rememberMe);

      // Route based on server-verified role or redirect path if authorized
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
        // Redirect to OTP verification page
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

  const handleGoogleAuth = () => {
    // Simulated Google OAuth SSO
    setIsSubmitting(true);
    setTimeout(async () => {
      try {
        const user = await login('patient@careq.ai', 'Password@123', true);
        navigate(user.role === 'admin' ? '/admin/dashboard' : user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
      } catch (err: any) {
        setErrors({ general: err.message });
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to CareQ AI"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          leftIcon={<Mail size={18} />}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          isPassword
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          leftIcon={<Lock size={18} />}
          required
          autoComplete="current-password"
        />

        {/* Remember Me & Forgot Password Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem'
          }}
        >
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label="Remember me"
          />

          <Link
            to="/auth/forgot-password"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--primary-600)'
            }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Primary Login Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<LogIn size={18} />}
        >
          Login to CareQ AI
        </Button>

        {/* Google OAuth Option */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '8px 0'
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--slate-200)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-400)', letterSpacing: '0.05em' }}>
            OR
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--slate-200)' }} />
        </div>

        {/* Registration Pathways */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            Don't have an account?
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Link
              to="/auth/register/patient"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: '#ffffff',
                border: '1.5px solid var(--primary-600)',
                color: 'var(--primary-700)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              <UserPlus size={15} />
              <span>Register as Patient</span>
            </Link>

            <Link
              to="/auth/register/doctor"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: '#ffffff',
                border: '1.5px solid var(--accent-600)',
                color: 'var(--accent-600)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              <Stethoscope size={15} />
              <span>Register as Doctor</span>
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};
