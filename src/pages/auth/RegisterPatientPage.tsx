import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/common/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Checkbox } from '../../components/common/Checkbox';
import { Alert } from '../../components/common/Alert';
import { PasswordStrengthIndicator } from '../../components/common/PasswordStrength';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, UserPlus, Stethoscope } from 'lucide-react';
import { isValidEmail, isValidPhone, evaluatePasswordStrength } from '../../utils/validation';

export const RegisterPatientPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    termsAccepted?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerPatient } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: typeof errors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your complete legal name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for telemedicine verification.';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please provide a valid phone number with area code.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else {
      const strength = evaluatePasswordStrength(formData.password);
      if (strength.score < 2) {
        newErrors.password = 'Password is too weak. Please include letters, numbers, and special characters.';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the HIPAA Consent, Terms of Service, and Privacy Policy.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await registerPatient(formData);
      // Registration successful -> proceed to OTP verification
      navigate(`/auth/verify?email=${encodeURIComponent(formData.email)}&type=patient`);
    } catch (err: any) {
      setErrors({
        general: err.message || 'Registration failed. Please check your information.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your CareQ AI account"
      subtitle="Join thousands of patients receiving intelligent, personalized healthcare"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {errors.general && (
          <Alert
            type="error"
            title="Registration Error"
            message={errors.general}
            onClose={() => setErrors((prev) => ({ ...prev, general: undefined }))}
          />
        )}

        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="e.g. Eleanor Vance"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          error={errors.fullName}
          leftIcon={<User size={18} />}
          required
          autoComplete="name"
        />

        <Input
          label="Email address"
          type="email"
          name="email"
          placeholder="eleanor@example.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          leftIcon={<Mail size={18} />}
          required
          autoComplete="email"
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
          leftIcon={<Phone size={18} />}
          helperText="Used for appointment reminders and 2-factor verification."
          required
          autoComplete="tel"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Input
            label="Create Password"
            isPassword
            name="password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            leftIcon={<Lock size={18} />}
            required
            autoComplete="new-password"
          />
          <PasswordStrengthIndicator password={formData.password} />
        </div>

        <Input
          label="Confirm Password"
          isPassword
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          leftIcon={<Lock size={18} />}
          required
          autoComplete="new-password"
        />

        <Checkbox
          id="patient-terms"
          checked={formData.termsAccepted}
          onChange={(e) => handleChange('termsAccepted', e.target.checked)}
          error={errors.termsAccepted}
          label={
            <span>
              I agree to the{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()}>
                CareQ AI Terms of Service
              </a>
              ,{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
              , and acknowledge{' '}
              <a href="#hipaa" onClick={(e) => e.preventDefault()}>
                HIPAA Telehealth Consent
              </a>
              .
            </span>
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<UserPlus size={18} />}
        >
          Create Patient Account
        </Button>

        {/* Links to Login & Doctor Registration */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center',
            marginTop: '8px',
            paddingTop: '16px',
            borderTop: '1px solid var(--slate-200)',
            fontSize: '0.875rem'
          }}
        >
          <div>
            Already have an account?{' '}
            <Link to="/auth/login" style={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate-600)' }}>
            <span>Are you a medical doctor?</span>
            <Link
              to="/auth/register/doctor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
                color: 'var(--accent-600)'
              }}
            >
              <Stethoscope size={14} />
              Register as Doctor
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};
