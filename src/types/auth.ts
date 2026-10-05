export type UserRole = 'patient' | 'doctor' | 'admin';

export type DoctorVerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface DoctorDocument {
  id: string;
  type: 'license' | 'degree' | 'id_proof';
  name: string;
  size: string;
  uploadedAt: string;
  url?: string;
  verified?: boolean;
}

export interface DoctorProfile {
  specialization: string;
  qualification: string;
  medicalRegNo: string;
  experienceYears: number;
  hospitalName: string;
  verificationStatus: DoctorVerificationStatus;
  documents: DoctorDocument[];
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface PatientProfile {
  bloodGroup?: string;
  allergies?: string[];
  emergencyContact?: string;
  dateOfBirth?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  avatarUrl?: string;
  doctorProfile?: DoctorProfile;
  patientProfile?: PatientProfile;
  createdAt: string;
  lastLoginAt?: string;
  mfaEnabled?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // in seconds
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterPatientPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface RegisterDoctorPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  specialization: string;
  qualification: string;
  medicalRegNo: string;
  experienceYears: number;
  hospitalName: string;
  documents: Array<{
    type: 'license' | 'degree' | 'id_proof';
    name: string;
    size: string;
  }>;
  termsAccepted: boolean;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  purpose?: 'registration' | 'password_reset' | 'mfa';
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
