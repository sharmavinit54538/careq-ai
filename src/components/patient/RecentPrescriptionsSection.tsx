import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, AlertCircle, RefreshCw, Calendar, UserCheck } from 'lucide-react';
import type { Prescription } from '../../types/patient';

interface RecentPrescriptionsSectionProps {
  prescriptions: Prescription[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewPrescription: (prescription: Prescription) => void;
}

export const RecentPrescriptionsSection: React.FC<RecentPrescriptionsSectionProps> = ({
  prescriptions,
  isLoading,
  isError,
  onRetry,
  onViewPrescription
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Pill className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-slate-900">
              Recent Prescriptions
            </h3>
            <p className="text-[11px] font-medium text-slate-600">
              Doctor-authorized medications & dosages
            </p>
          </div>
        </div>

        <Link
          to="/patient/prescriptions"
          className="text-xs font-bold text-teal-600 hover:text-teal-700 focus:outline-none"
        >
          View All &rarr;
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-20 rounded-2xl bg-slate-100" />
          <div className="h-20 rounded-2xl bg-slate-100" />
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600 mb-2" />
          <p className="text-sm font-bold text-rose-900">
            Unable to load prescriptions.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-rose-700 border border-rose-300 shadow-xs hover:bg-rose-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && prescriptions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <Pill className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">
            No prescriptions yet.
          </h4>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no active or archived medications prescribed by your healthcare providers.
          </p>
          <Link
            to="/patient/prescriptions"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          >
            <span>View All Prescriptions</span>
          </Link>
        </div>
      )}

      {/* Prescriptions List */}
      {!isLoading && !isError && prescriptions.length > 0 && (
        <div className="space-y-3">
          {prescriptions.slice(0, 3).map((rx) => (
            <div
              key={rx.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 transition-all hover:shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {rx.medicineName}
                  </h4>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                      rx.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rx.status === 'completed'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {rx.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-teal-700">
                  {rx.dosage} &bull; {rx.frequency}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-slate-400" />
                    {rx.doctorName}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {rx.date}
                  </span>
                  <span>&bull;</span>
                  <span>Duration: {rx.duration}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onViewPrescription(rx)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-colors"
                >
                  View Prescription
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
