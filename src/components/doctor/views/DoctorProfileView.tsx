import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Clock,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Award,
  IndianRupee,
  Globe,
  Edit3,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface DoctorProfileViewProps {
  onOpenEditModal: () => void;
}

export const DoctorProfileView: React.FC<DoctorProfileViewProps> = ({
  onOpenEditModal
}) => {
  const { user } = useAuth();
  const profile = user?.doctorProfile;
  const isApproved = profile?.verificationStatus !== 'rejected';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Dr. Doctor')}&background=0d9488&color=fff`
              }
              alt={user?.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-teal-500 shadow-md flex-shrink-0"
            />

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user?.name || 'Dr. Evelyn Reed'}
                </h2>

                {isApproved ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>✓ Verified Physician</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Clock size={14} className="text-amber-600" />
                    <span>Pending Verification</span>
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-teal-700">
                {profile?.specialization || 'Cardiology & Internal Medicine'}
              </p>

              <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{profile?.qualification || 'MD, FACC'}</span>
                <span>&bull;</span>
                <span>{profile?.hospitalName || 'Mount Sinai Cardiovascular Institute'}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenEditModal}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Medical Reg No.
            </span>
            <span className="text-sm font-extrabold text-slate-900 mt-1 block">
              {profile?.medicalRegNo || 'MED-REG-847291-NY'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Clinical Experience
            </span>
            <span className="text-sm font-extrabold text-slate-900 mt-1 block">
              {profile?.experienceYears || 14} Years Active
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Consultation Fee
            </span>
            <span className="text-sm font-extrabold text-teal-800 mt-1 block">
              ₹1,500 / Session
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Languages Spoken
            </span>
            <span className="text-sm font-extrabold text-slate-900 mt-1 block">
              English, Hindi, Spanish
            </span>
          </div>
        </div>
      </div>

      {/* Contact & Practice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
            Contact &amp; Account Details
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Email Address</span>
              <span className="font-bold text-slate-900">{user?.email}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Direct Telephone</span>
              <span className="font-bold text-slate-900">{user?.phone || '+1 (555) 456-7890'}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Primary Hospital / Clinic</span>
              <span className="font-bold text-slate-900 text-right">
                {profile?.hospitalName || 'Mount Sinai Cardiovascular Institute'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 font-medium">Account Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Active Member
              </span>
            </div>
          </div>
        </div>

        {/* Professional Biography */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
            About the Physician
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Board-certified cardiovascular specialist with over a decade of clinical practice at leading tertiary teaching hospitals. Specializing in preventive cardiology, hypertension control, lipidology, and digital health telemedicine. Dedicated to evidence-based, compassionate patient care with holistic lifestyle intervention.
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-teal-800">
            <ShieldCheck size={16} className="text-teal-600" />
            <span>Authenticated CareQ AI Medical Governance Board Member</span>
          </div>
        </div>
      </div>
    </div>
  );
};
