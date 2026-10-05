import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  Shield,
  Edit,
  CheckCircle2,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import type { User as AuthUser } from '../../../types/auth';

interface ProfileViewProps {
  user: AuthUser | null;
  onEditProfile: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onEditProfile
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      navigate('/auth/login', { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
            Patient Medical Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified patient demographics, identity credentials, and emergency records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={onEditProfile}
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all cursor-pointer"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 hover:border-rose-300 active:scale-95 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-8">
          <img
            src={
              user?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || 'Patient'
              )}&background=0d9488&color=fff`
            }
            alt={user?.name || 'Patient'}
            className="h-24 w-24 rounded-3xl object-cover ring-4 ring-slate-100 shadow-md flex-shrink-0"
          />

          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h3 className="text-2xl font-heading font-extrabold text-slate-900">
                {user?.name}
              </h3>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified Patient
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Patient Identification: <span className="font-mono">{user?.id}</span> &bull; Enrolled:{' '}
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-teal-600" />
                {user?.email}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-teal-600" />
                {user?.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Demographics & Medical Indicators */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              Date of Birth
            </span>
            <p className="mt-1 text-base font-extrabold text-slate-900">
              {user?.patientProfile?.dateOfBirth || 'June 15, 1992'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <User className="h-4 w-4 text-slate-400" />
              Gender
            </span>
            <p className="mt-1 text-base font-extrabold text-slate-900">
              Female
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-rose-500" />
              Blood Group
            </span>
            <p className="mt-1 text-base font-extrabold text-slate-900">
              {user?.patientProfile?.bloodGroup || 'O+'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-sky-500" />
              Emergency Contact
            </span>
            <p className="mt-1 text-base font-extrabold text-slate-900">
              {user?.patientProfile?.emergencyContact || '+1 (555) 876-5432'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:col-span-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Known Clinical Allergies
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {user?.patientProfile?.allergies && user.patientProfile.allergies.length > 0 ? (
                user.patientProfile.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-bold text-rose-800"
                  >
                    {allergy}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">
                  No known medication or environmental allergies reported.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Session & Security Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Account Session & Security</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Signed in as <span className="font-semibold text-slate-700">{user?.email || 'patient@careq.ai'}</span> &bull; Status: <span className="text-emerald-600 font-semibold">Active Session</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 hover:border-rose-300 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out of CareQ</span>
        </button>
      </div>
    </div>
  );
};
