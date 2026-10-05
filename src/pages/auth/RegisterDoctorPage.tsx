import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/common/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Checkbox } from '../../components/common/Checkbox';
import { Alert } from '../../components/common/Alert';
import { PasswordStrengthIndicator } from '../../components/common/PasswordStrength';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Stethoscope,
  Award,
  FileText,
  Building2,
  Calendar,
  Upload,
  CheckCircle,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { isValidEmail, isValidPhone, evaluatePasswordStrength } from '../../utils/validation';

export const RegisterDoctorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    specialization: '',
    qualification: '',
    medicalRegNo: '',
    experienceYears: 5,
    hospitalName: ''
  });

  const [documents, setDocuments] = useState<
    Array<{ type: 'license' | 'degree' | 'id_proof'; name: string; size: string }>
  >([
    { type: 'license', name: 'State_Medical_Council_License.pdf', size: '2.1 MB' },
    { type: 'degree', name: 'Medical_Degree_MD_MBBS.pdf', size: '3.4 MB' },
    { type: 'id_proof', name: 'Government_Photo_ID.pdf', size: '1.1 MB' }
  ]);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerDoctor } = useAuth();
  const navigate = useNavigate();

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!personalInfo.fullName.trim()) {
      newErrors.fullName = 'Full legal name is required.';
    }

    if (!personalInfo.email.trim()) {
      newErrors.email = 'Work email address is required.';
    } else if (!isValidEmail(personalInfo.email)) {
      newErrors.email = 'Please provide a valid work email format.';
    }

    if (!personalInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required for doctor contact.';
    } else if (!isValidPhone(personalInfo.phone)) {
      newErrors.phone = 'Please provide a valid phone number.';
    }

    if (!personalInfo.password) {
      newErrors.password = 'Password is required.';
    } else {
      const strength = evaluatePasswordStrength(personalInfo.password);
      if (strength.score < 2) {
        newErrors.password = 'Password must meet clinical security standards.';
      }
    }

    if (!personalInfo.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (personalInfo.password !== personalInfo.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(2);
  };

  const handleDocumentChange = (
    type: 'license' | 'degree' | 'id_proof',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setDocuments((prev) => [
        ...prev.filter((d) => d.type !== type),
        { type, name: file.name, size: sizeMB }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!professionalInfo.specialization.trim()) {
      newErrors.specialization = 'Primary medical specialization is required.';
    }
    if (!professionalInfo.qualification.trim()) {
      newErrors.qualification = 'Highest medical qualification is required (e.g. MD, MBBS, DO).';
    }
    if (!professionalInfo.medicalRegNo.trim()) {
      newErrors.medicalRegNo = 'State/National Medical Board Registration Number is mandatory.';
    }
    if (!professionalInfo.hospitalName.trim()) {
      newErrors.hospitalName = 'Affiliated Clinic or Hospital name is required.';
    }
    if (!termsAccepted) {
      newErrors.termsAccepted = 'You must acknowledge the clinical practice agreement and admin review terms.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await registerDoctor({
        ...personalInfo,
        ...professionalInfo,
        documents,
        termsAccepted
      });

      // Redirect to OTP verification with doctor parameter
      navigate(`/auth/verify?email=${encodeURIComponent(personalInfo.email)}&type=doctor`);
    } catch (err: any) {
      setErrors({
        general: err.message || 'Registration failed. Please check your credentials.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Join CareQ AI as a Doctor"
      subtitle="Expand your clinical reach with real-time AI triage and integrated patient care"
    >
      {/* Progress Step Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          background: 'var(--slate-50)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--slate-200)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: currentStep >= 1 ? 'var(--primary-600)' : 'var(--slate-300)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8125rem',
              fontWeight: 700
            }}
          >
            1
          </div>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: currentStep === 1 ? 700 : 500,
              color: currentStep === 1 ? 'var(--slate-900)' : 'var(--slate-500)'
            }}
          >
            Personal Details
          </span>
        </div>

        <div style={{ height: '2px', width: '32px', background: currentStep === 2 ? 'var(--primary-600)' : 'var(--slate-200)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: currentStep === 2 ? 'var(--primary-600)' : 'var(--slate-200)',
              color: currentStep === 2 ? '#ffffff' : 'var(--slate-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8125rem',
              fontWeight: 700
            }}
          >
            2
          </div>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: currentStep === 2 ? 700 : 500,
              color: currentStep === 2 ? 'var(--slate-900)' : 'var(--slate-500)'
            }}
          >
            Medical Verification
          </span>
        </div>
      </div>

      {errors.general && (
        <div style={{ marginBottom: '16px' }}>
          <Alert
            type="error"
            title="Registration Error"
            message={errors.general}
            onClose={() => setErrors((prev) => ({ ...prev, general: undefined }))}
          />
        </div>
      )}

      {currentStep === 1 ? (
        /* STEP 1: Personal Information */
        <form onSubmit={handleStep1Next} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Full Name (with Title)"
            type="text"
            placeholder="e.g. Dr. Julian Vance"
            value={personalInfo.fullName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
            error={errors.fullName}
            leftIcon={<User size={18} />}
            required
          />

          <Input
            label="Professional Email"
            type="email"
            placeholder="doctor@hospital.org"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            error={errors.email}
            leftIcon={<Mail size={18} />}
            required
          />

          <Input
            label="Contact Phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            error={errors.phone}
            leftIcon={<Phone size={18} />}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Input
              label="Account Password"
              isPassword
              placeholder="Minimum 8 characters"
              value={personalInfo.password}
              onChange={(e) => setPersonalInfo({ ...personalInfo, password: e.target.value })}
              error={errors.password}
              leftIcon={<Lock size={18} />}
              required
            />
            <PasswordStrengthIndicator password={personalInfo.password} />
          </div>

          <Input
            label="Confirm Password"
            isPassword
            placeholder="Re-enter password"
            value={personalInfo.confirmPassword}
            onChange={(e) => setPersonalInfo({ ...personalInfo, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            leftIcon={<Lock size={18} />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight size={18} />}
          >
            Continue to Medical Credentials
          </Button>

          <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '8px' }}>
            Already registered?{' '}
            <Link to="/auth/login" style={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </form>
      ) : (
        /* STEP 2: Medical Credentials & Verification Documents */
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Important Information Notice Card */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              color: '#1e40af',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              display: 'flex',
              gap: '12px'
            }}
          >
            <AlertTriangle size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '2px' }}>CareQ AI Credentialing Notice:</strong>
              Your professional profile will be reviewed by the CareQ AI administration team before you can provide consultations.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Primary Specialization"
              placeholder="e.g. Cardiology"
              value={professionalInfo.specialization}
              onChange={(e) => setProfessionalInfo({ ...professionalInfo, specialization: e.target.value })}
              error={errors.specialization}
              leftIcon={<Stethoscope size={18} />}
              required
            />

            <Input
              label="Highest Qualification"
              placeholder="e.g. MD, MBBS, FACC"
              value={professionalInfo.qualification}
              onChange={(e) => setProfessionalInfo({ ...professionalInfo, qualification: e.target.value })}
              error={errors.qualification}
              leftIcon={<Award size={18} />}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
            <Input
              label="Medical Registration No."
              placeholder="e.g. MED-REG-847291"
              value={professionalInfo.medicalRegNo}
              onChange={(e) => setProfessionalInfo({ ...professionalInfo, medicalRegNo: e.target.value })}
              error={errors.medicalRegNo}
              leftIcon={<FileText size={18} />}
              required
            />

            <Input
              label="Years of Experience"
              type="number"
              min={1}
              max={60}
              placeholder="5"
              value={professionalInfo.experienceYears}
              onChange={(e) =>
                setProfessionalInfo({ ...professionalInfo, experienceYears: Number(e.target.value) })
              }
              leftIcon={<Calendar size={18} />}
              required
            />
          </div>

          <Input
            label="Affiliated Clinic or Hospital Name"
            placeholder="e.g. Mount Sinai Medical Center"
            value={professionalInfo.hospitalName}
            onChange={(e) => setProfessionalInfo({ ...professionalInfo, hospitalName: e.target.value })}
            error={errors.hospitalName}
            leftIcon={<Building2 size={18} />}
            required
          />

          {/* Verification Documents Upload Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
              Verification Documents (Required for board approval)
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { type: 'license' as const, label: 'Medical Board License', req: 'PDF, JPG up to 10MB' },
                { type: 'degree' as const, label: 'Medical Degree / Certificate', req: 'Accredited university diploma' },
                { type: 'id_proof' as const, label: 'Identity Proof (Passport / Driver License)', req: 'Government-issued ID' }
              ].map((docItem) => {
                const currentDoc = documents.find((d) => d.type === docItem.type);
                return (
                  <div
                    key={docItem.type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--slate-200)',
                      background: 'var(--slate-50)',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileCheck size={18} color="var(--primary-600)" />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{docItem.label}</div>
                        <div style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>
                          {currentDoc ? `${currentDoc.name} (${currentDoc.size})` : docItem.req}
                        </div>
                      </div>
                    </div>

                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: '#ffffff',
                        border: '1px solid var(--slate-300)',
                        color: 'var(--slate-700)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Upload size={13} />
                      <span>{currentDoc ? 'Replace' : 'Upload'}</span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        style={{ display: 'none' }}
                        onChange={(e) => handleDocumentChange(docItem.type, e)}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <Checkbox
            id="doctor-terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            error={errors.termsAccepted}
            label={
              <span>
                I certify that all medical credentials and registration numbers submitted are valid, and I agree to the{' '}
                <a href="#physician-agreement" onClick={(e) => e.preventDefault()}>
                  Physician Terms of Service
                </a>{' '}
                and review process.
              </span>
            }
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => setCurrentStep(1)}
              leftIcon={<ArrowLeft size={18} />}
            >
              Back
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<CheckCircle size={18} />}
            >
              Submit Doctor Application
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
