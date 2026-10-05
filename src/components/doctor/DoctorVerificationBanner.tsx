import React from 'react';
import { Clock, AlertTriangle, ShieldX, CheckCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DoctorVerificationBannerProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DoctorVerificationBanner: React.FC<DoctorVerificationBannerProps> = ({
  onRefresh,
  isRefreshing = false
}) => {
  const { user } = useAuth();
  const doctorProfile = user?.doctorProfile;
  const status = doctorProfile?.verificationStatus || 'pending';

  if (status === 'approved') return null;

  return (
    <div className="mb-8 rounded-2xl overflow-hidden border shadow-xs transition-all duration-200">
      {status === 'pending' ? (
        <div className="bg-amber-50/80 border-amber-200 p-5 sm:p-6 text-amber-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 flex-shrink-0 mt-0.5 sm:mt-0">
                <Clock size={24} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base sm:text-lg text-amber-950">
                    Doctor Account Pending Medical Board Verification
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                    Audit In Progress
                  </span>
                </div>
                <p className="text-sm text-amber-800/90 leading-relaxed max-w-3xl">
                  Your state medical registration (
                  <strong className="text-amber-950">{doctorProfile?.medicalRegNo || 'Pending Submission'}</strong>
                  ) and uploaded credentials are being reviewed by the CareQ AI medical compliance board.
                  Live consultations and e-prescription issuance remain restricted until verification is complete.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-amber-800 font-medium">
                  <span>⏱ Estimated turnaround: 2 to 4 business hours</span>
                  <span>&bull;</span>
                  <span className="text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    💡 Testing Tip: Log in as Admin (<span className="font-mono">admin@careq.ai</span>) to approve this doctor instantly.
                  </span>
                </div>
              </div>
            </div>

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="self-stretch sm:self-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-60"
              >
                <span>{isRefreshing ? 'Checking...' : 'Refresh Status'}</span>
              </button>
            )}
          </div>
        </div>
      ) : status === 'rejected' ? (
        <div className="bg-rose-50 border-rose-200 p-5 sm:p-6 text-rose-900">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-rose-100 rounded-xl text-rose-700 flex-shrink-0">
              <ShieldX size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base sm:text-lg text-rose-950">
                Medical Board Verification Not Approved
              </h3>
              <p className="text-sm text-rose-800/90 leading-relaxed max-w-3xl">
                {doctorProfile?.rejectionReason ||
                  'The medical license details or submitted qualification documents could not be validated with state registry records.'}
              </p>
              <p className="text-xs text-rose-700 pt-1">
                Please contact <strong className="underline">compliance@careq.ai</strong> to resubmit supporting credentials or appeal this decision.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 border-slate-300 p-5 sm:p-6 text-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-slate-200 rounded-xl text-slate-700 flex-shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">Account Access Suspended</h3>
              <p className="text-sm text-slate-600">
                Your clinical practice access is temporarily paused. Please reach out to administrative support.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
