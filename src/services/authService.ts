import {
  User,
  AuthResponse,
  AuthTokens,
  RegisterPatientPayload,
  RegisterDoctorPayload,
  DoctorVerificationStatus,
  DoctorDocument
} from '../types/auth';

const STORAGE_USERS_KEY = 'careq_users_db_v1';
const STORAGE_SESSIONS_KEY = 'careq_session_token_v1';
const STORAGE_OTP_KEY = 'careq_otps_db_v1';
const STORAGE_RESET_KEY = 'careq_pwd_resets_db_v1';

interface StoredUser extends User {
  passwordHash: string; // In production this is hashed with bcrypt/argon2
}

interface StoredOTP {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
  purpose: string;
}

interface StoredResetToken {
  token: string;
  email: string;
  expiresAt: number;
  used: boolean;
}

// Initial Seed Data with all 3 Roles
const SEED_USERS: StoredUser[] = [
  {
    id: 'usr_pat_001',
    name: 'Sarah Jenkins',
    email: 'patient@careq.ai',
    phone: '+1 (555) 234-5678',
    passwordHash: 'Password@123',
    role: 'patient',
    status: 'active',
    emailVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    patientProfile: {
      bloodGroup: 'O+',
      allergies: ['Penicillin'],
      emergencyContact: '+1 (555) 876-5432'
    },
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'usr_pat_002',
    name: 'David Martinez',
    email: 'unverified.patient@careq.ai',
    phone: '+1 (555) 345-6789',
    passwordHash: 'Password@123',
    role: 'patient',
    status: 'active',
    emailVerified: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'usr_doc_001',
    name: 'Dr. Evelyn Reed',
    email: 'doctor@careq.ai',
    phone: '+1 (555) 456-7890',
    passwordHash: 'Password@123',
    role: 'doctor',
    status: 'active',
    emailVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
    doctorProfile: {
      specialization: 'Cardiology & Internal Medicine',
      qualification: 'MD, FACC, Harvard Medical School',
      medicalRegNo: 'MED-REG-847291-NY',
      experienceYears: 14,
      hospitalName: 'Mount Sinai Cardiovascular Institute',
      verificationStatus: 'approved',
      reviewedBy: 'Admin Board',
      reviewedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      documents: [
        {
          id: 'doc_101',
          type: 'license',
          name: 'New_York_State_Medical_License.pdf',
          size: '2.4 MB',
          uploadedAt: '2025-11-12',
          verified: true
        },
        {
          id: 'doc_102',
          type: 'degree',
          name: 'Harvard_MD_Cardiology_Fellowship.pdf',
          size: '3.8 MB',
          uploadedAt: '2025-11-12',
          verified: true
        },
        {
          id: 'doc_103',
          type: 'id_proof',
          name: 'Passport_Verification_ID.pdf',
          size: '1.2 MB',
          uploadedAt: '2025-11-12',
          verified: true
        }
      ]
    },
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString()
  },
  {
    id: 'usr_doc_002',
    name: 'Dr. Marcus Vance',
    email: 'pending.doctor@careq.ai',
    phone: '+1 (555) 789-0123',
    passwordHash: 'Password@123',
    role: 'doctor',
    status: 'active',
    emailVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
    doctorProfile: {
      specialization: 'Neurology & Cognitive Sciences',
      qualification: 'MBBS, MD Neurology, Johns Hopkins',
      medicalRegNo: 'MED-REG-991204-CA',
      experienceYears: 6,
      hospitalName: 'Stanford Healthcare Pavilion',
      verificationStatus: 'pending',
      documents: [
        {
          id: 'doc_201',
          type: 'license',
          name: 'California_State_Board_License.pdf',
          size: '1.9 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          verified: false
        },
        {
          id: 'doc_202',
          type: 'degree',
          name: 'Johns_Hopkins_Neurology_MD.pdf',
          size: '4.1 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          verified: false
        },
        {
          id: 'doc_203',
          type: 'id_proof',
          name: 'Government_RealID_Card.pdf',
          size: '850 KB',
          uploadedAt: new Date().toISOString().split('T')[0],
          verified: false
        }
      ]
    },
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'usr_adm_001',
    name: 'Elena Rostova',
    email: 'admin@careq.ai',
    phone: '+1 (555) 999-0000',
    passwordHash: 'Password@123',
    role: 'admin',
    status: 'active',
    emailVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    mfaEnabled: true,
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString()
  }
];

class AuthService {
  private users: StoredUser[] = [];
  private otps: StoredOTP[] = [];
  private resetTokens: StoredResetToken[] = [];

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = [...SEED_USERS];
        this.saveUsers();
      }

      const storedOtps = localStorage.getItem(STORAGE_OTP_KEY);
      if (storedOtps) {
        this.otps = JSON.parse(storedOtps);
      } else {
        // Pre-seed a known verification OTP for demo ease
        this.otps = [
          {
            email: 'unverified.patient@careq.ai',
            code: '123456',
            expiresAt: Date.now() + 24 * 3600000,
            attempts: 0,
            purpose: 'registration'
          }
        ];
        this.saveOtps();
      }

      const storedResets = localStorage.getItem(STORAGE_RESET_KEY);
      if (storedResets) {
        this.resetTokens = JSON.parse(storedResets);
      }
    } catch {
      this.users = [...SEED_USERS];
    }
  }

  private saveUsers() {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(this.users));
  }

  private saveOtps() {
    localStorage.setItem(STORAGE_OTP_KEY, JSON.stringify(this.otps));
  }

  private saveResets() {
    localStorage.setItem(STORAGE_RESET_KEY, JSON.stringify(this.resetTokens));
  }

  private delay(ms = 400) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private sanitizeUser(user: StoredUser): User {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private generateTokens(userId: string): AuthTokens {
    const timestamp = Date.now();
    return {
      accessToken: `cq_at_${btoa(`${userId}:${timestamp}:${Math.random()}`)}`,
      refreshToken: `cq_rt_${btoa(`${userId}:${timestamp + 7 * 86400000}:${Math.random()}`)}`,
      expiresIn: 3600 // 1 hour
    };
  }

  // --- Unified Login ---
  async login(email: string, password: string, rememberMe = false): Promise<AuthResponse> {
    await this.delay(500);

    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    if (user.passwordHash !== password) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    if (user.status === 'suspended') {
      throw new Error('This account has been suspended. Please contact CareQ AI compliance support.');
    }

    if (!user.emailVerified) {
      // Must verify email first
      const error: any = new Error('Email verification is required before signing in.');
      error.requiresVerification = true;
      error.email = user.email;
      error.phone = user.phone;
      throw error;
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    this.saveUsers();

    const tokens = this.generateTokens(user.id);
    const safeUser = this.sanitizeUser(user);

    // Save active session
    const sessionData = {
      user: safeUser,
      tokens,
      rememberMe,
      savedAt: Date.now()
    };
    if (rememberMe) {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessionData));
      localStorage.removeItem(STORAGE_SESSIONS_KEY);
    }

    return { user: safeUser, tokens };
  }

  // --- Patient Registration ---
  async registerPatient(payload: RegisterPatientPayload): Promise<{ user: User; requiresVerification: boolean }> {
    await this.delay(600);

    const normalizedEmail = payload.email.trim().toLowerCase();
    if (this.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: StoredUser = {
      id: `usr_pat_${Date.now()}`,
      name: payload.fullName.trim(),
      email: normalizedEmail,
      phone: payload.phone.trim(),
      passwordHash: payload.password,
      role: 'patient', // Enforced by backend
      status: 'active',
      emailVerified: false,
      patientProfile: {
        bloodGroup: 'Not specified'
      },
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();

    // Generate OTP
    const code = '123456'; // Default deterministic code for demo predictability, or generated
    this.otps = this.otps.filter((o) => o.email.toLowerCase() !== normalizedEmail);
    this.otps.push({
      email: normalizedEmail,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
      purpose: 'registration'
    });
    this.saveOtps();

    return {
      user: this.sanitizeUser(newUser),
      requiresVerification: true
    };
  }

  // --- Doctor Registration ---
  async registerDoctor(payload: RegisterDoctorPayload): Promise<{ user: User; requiresVerification: boolean }> {
    await this.delay(700);

    const normalizedEmail = payload.email.trim().toLowerCase();
    if (this.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const doctorDocs: DoctorDocument[] = payload.documents.map((d, index) => ({
      id: `doc_${Date.now()}_${index}`,
      type: d.type,
      name: d.name,
      size: d.size,
      uploadedAt: new Date().toISOString().split('T')[0],
      verified: false
    }));

    const newDoctor: StoredUser = {
      id: `usr_doc_${Date.now()}`,
      name: payload.fullName.trim(),
      email: normalizedEmail,
      phone: payload.phone.trim(),
      passwordHash: payload.password,
      role: 'doctor', // Enforced by backend
      status: 'active',
      emailVerified: false,
      doctorProfile: {
        specialization: payload.specialization.trim(),
        qualification: payload.qualification.trim(),
        medicalRegNo: payload.medicalRegNo.trim(),
        experienceYears: Number(payload.experienceYears) || 1,
        hospitalName: payload.hospitalName.trim(),
        verificationStatus: 'pending', // Doctors always start as pending
        documents: doctorDocs
      },
      createdAt: new Date().toISOString()
    };

    this.users.push(newDoctor);
    this.saveUsers();

    // Create OTP
    const code = '123456';
    this.otps = this.otps.filter((o) => o.email.toLowerCase() !== normalizedEmail);
    this.otps.push({
      email: normalizedEmail,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
      purpose: 'registration'
    });
    this.saveOtps();

    return {
      user: this.sanitizeUser(newDoctor),
      requiresVerification: true
    };
  }

  // --- Verify OTP ---
  async verifyOtp(email: string, otpCode: string): Promise<AuthResponse> {
    await this.delay(500);

    const normalizedEmail = email.trim().toLowerCase();
    const otpRecord = this.otps.find((o) => o.email.toLowerCase() === normalizedEmail);

    if (!otpRecord) {
      throw new Error('No active verification code found for this email. Please request a new one.');
    }

    if (Date.now() > otpRecord.expiresAt) {
      throw new Error('This verification code has expired. Please request a fresh one.');
    }

    if (otpRecord.attempts >= 5) {
      throw new Error('Maximum verification attempts exceeded. Please request a new verification code.');
    }

    otpRecord.attempts++;
    this.saveOtps();

    // Allow '123456' as master bypass for easy testing, plus the exact code
    if (otpCode !== otpRecord.code && otpCode !== '123456') {
      throw new Error('Invalid 6-digit verification code. Please check and try again.');
    }

    // Success: activate user email verification
    const user = this.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      throw new Error('User account not found.');
    }

    user.emailVerified = true;
    this.saveUsers();

    // Remove used OTP
    this.otps = this.otps.filter((o) => o.email.toLowerCase() !== normalizedEmail);
    this.saveOtps();

    const tokens = this.generateTokens(user.id);
    const safeUser = this.sanitizeUser(user);

    // Save session
    const sessionData = {
      user: safeUser,
      tokens,
      rememberMe: true,
      savedAt: Date.now()
    };
    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessionData));

    return { user: safeUser, tokens };
  }

  // --- Resend OTP ---
  async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
    await this.delay(400);

    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      throw new Error('Account with this email does not exist.');
    }

    const code = '123456';
    this.otps = this.otps.filter((o) => o.email.toLowerCase() !== normalizedEmail);
    this.otps.push({
      email: normalizedEmail,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
      purpose: 'registration'
    });
    this.saveOtps();

    return {
      success: true,
      message: 'A fresh 6-digit verification code has been dispatched to your email.'
    };
  }

  // --- Forgot Password ---
  async forgotPassword(email: string): Promise<{ success: boolean; message: string; debugToken?: string }> {
    await this.delay(500);

    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    let token = '';
    if (user) {
      token = `cq_rst_${Math.random().toString(36).substring(2)}${Date.now()}`;
      this.resetTokens = this.resetTokens.filter((r) => r.email.toLowerCase() !== normalizedEmail);
      this.resetTokens.push({
        token,
        email: normalizedEmail,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
        used: false
      });
      this.saveResets();
    }

    // Always return generic message to prevent account enumeration
    return {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
      debugToken: token || undefined
    };
  }

  // --- Validate Reset Token ---
  async validateResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    await this.delay(300);

    const reset = this.resetTokens.find((r) => r.token === token);
    if (!reset || reset.used || Date.now() > reset.expiresAt) {
      return { valid: false };
    }

    return { valid: true, email: reset.email };
  }

  // --- Reset Password ---
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    await this.delay(600);

    const reset = this.resetTokens.find((r) => r.token === token);
    if (!reset || reset.used || Date.now() > reset.expiresAt) {
      throw new Error('This password reset link is invalid or has expired. Please request a new link.');
    }

    const user = this.users.find((u) => u.email.toLowerCase() === reset.email.toLowerCase());
    if (!user) {
      throw new Error('User associated with this reset link no longer exists.');
    }

    user.passwordHash = newPassword;
    this.saveUsers();

    reset.used = true;
    this.saveResets();

    return { success: true };
  }

  // --- Get Current Session User ---
  async getCurrentUser(): Promise<User | null> {
    const raw = localStorage.getItem(STORAGE_SESSIONS_KEY) || sessionStorage.getItem(STORAGE_SESSIONS_KEY);
    if (!raw) return null;

    try {
      const data = JSON.parse(raw);
      // Fetch fresh user from DB to keep roles / doctor approval status updated!
      const freshUser = this.users.find((u) => u.id === data.user?.id);
      if (freshUser) {
        const safe = this.sanitizeUser(freshUser);
        // Refresh local cache
        data.user = safe;
        if (data.rememberMe) {
          localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(data));
        } else {
          sessionStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(data));
        }
        return safe;
      }
      return data.user || null;
    } catch {
      return null;
    }
  }

  // --- Refresh Token ---
  async refreshSession(): Promise<AuthTokens | null> {
    const raw = localStorage.getItem(STORAGE_SESSIONS_KEY) || sessionStorage.getItem(STORAGE_SESSIONS_KEY);
    if (!raw) return null;

    try {
      const session = JSON.parse(raw);
      const newTokens = this.generateTokens(session.user.id);
      session.tokens = newTokens;
      if (session.rememberMe) {
        localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(session));
      } else {
        sessionStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(session));
      }
      return newTokens;
    } catch {
      return null;
    }
  }

  // --- Logout ---
  async logout(): Promise<void> {
    await this.delay(200);
    localStorage.removeItem(STORAGE_SESSIONS_KEY);
    sessionStorage.removeItem(STORAGE_SESSIONS_KEY);
  }

  // --- Admin Methods: Doctor Verification Management ---
  async adminGetDoctorsList(): Promise<User[]> {
    await this.delay(300);
    return this.users.filter((u) => u.role === 'doctor').map((u) => this.sanitizeUser(u));
  }

  async adminUpdateDoctorStatus(
    doctorId: string,
    status: DoctorVerificationStatus,
    reason?: string
  ): Promise<User> {
    await this.delay(400);
    const doctor = this.users.find((u) => u.id === doctorId && u.role === 'doctor');
    if (!doctor || !doctor.doctorProfile) {
      throw new Error('Doctor record not found');
    }

    doctor.doctorProfile.verificationStatus = status;
    doctor.doctorProfile.reviewedBy = 'Elena Rostova (Admin)';
    doctor.doctorProfile.reviewedAt = new Date().toISOString();
    if (reason) {
      doctor.doctorProfile.rejectionReason = reason;
    } else {
      delete doctor.doctorProfile.rejectionReason;
    }

    // Mark documents verified if approved
    if (status === 'approved') {
      doctor.doctorProfile.documents.forEach((d) => (d.verified = true));
    }

    this.saveUsers();

    // If current session is this doctor, update it
    const raw = localStorage.getItem(STORAGE_SESSIONS_KEY) || sessionStorage.getItem(STORAGE_SESSIONS_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw);
        if (session.user?.id === doctorId) {
          session.user = this.sanitizeUser(doctor);
          if (session.rememberMe) {
            localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(session));
          } else {
            sessionStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(session));
          }
        }
      } catch {
        // ignore
      }
    }

    return this.sanitizeUser(doctor);
  }

  // Reset database to default seed (useful for testing)
  resetDemoDatabase() {
    this.users = [...SEED_USERS];
    this.saveUsers();
    this.otps = [
      {
        email: 'unverified.patient@careq.ai',
        code: '123456',
        expiresAt: Date.now() + 24 * 3600000,
        attempts: 0,
        purpose: 'registration'
      }
    ];
    this.saveOtps();
    this.resetTokens = [];
    this.saveResets();
    localStorage.removeItem(STORAGE_SESSIONS_KEY);
    sessionStorage.removeItem(STORAGE_SESSIONS_KEY);
  }
}

export const authService = new AuthService();
