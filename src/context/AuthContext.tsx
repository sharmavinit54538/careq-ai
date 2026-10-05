import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  User,
  UserRole,
  RegisterPatientPayload,
  RegisterDoctorPayload
} from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDoctorApproved: boolean;
  isDoctorPending: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  registerPatient: (payload: RegisterPatientPayload) => Promise<{ user: User; requiresVerification: boolean }>;
  registerDoctor: (payload: RegisterDoctorPayload) => Promise<{ user: User; requiresVerification: boolean }>;
  verifyOtp: (email: string, otp: string) => Promise<User>;
  resendOtp: (email: string) => Promise<string>;
  forgotPassword: (email: string) => Promise<{ message: string; debugToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  resetDatabase: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session
  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string, rememberMe = false): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password, rememberMe);
      setUser(response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const registerPatient = async (payload: RegisterPatientPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.registerPatient(payload);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const registerDoctor = async (payload: RegisterDoctorPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.registerDoctor(payload);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(email, otp);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string): Promise<string> => {
    const res = await authService.resendOtp(email);
    return res.message;
  };

  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await authService.resetPassword(token, newPassword);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetDatabase = () => {
    authService.resetDemoDatabase();
    setUser(null);
  };

  const role = user?.role || null;
  const isAuthenticated = !!user;
  const isDoctorApproved = user?.role === 'doctor' && user?.doctorProfile?.verificationStatus === 'approved';
  const isDoctorPending = user?.role === 'doctor' && user?.doctorProfile?.verificationStatus === 'pending';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        isDoctorApproved,
        isDoctorPending,
        login,
        registerPatient,
        registerDoctor,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        logout,
        refreshUser,
        resetDatabase
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
