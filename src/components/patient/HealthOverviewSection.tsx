import React from 'react';
import {
  Heart,
  Activity,
  Weight,
  Calendar,
  AlertCircle,
  Plus,
  RefreshCw,
  Scale
} from 'lucide-react';
import type { HealthVitals } from '../../types/patient';

interface HealthOverviewSectionProps {
  vitals: HealthVitals | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onAddHealthInfo: () => void;
}

export const HealthOverviewSection: React.FC<HealthOverviewSectionProps> = ({
  vitals,
  isLoading,
  isError,
  onRetry,
  onAddHealthInfo
}) => {
  const hasData =
    vitals &&
    (vitals.bloodPressure ||
      vitals.heartRate ||
      vitals.weight ||
      vitals.bmi ||
      vitals.lastCheckup ||
      vitals.nextFollowUp);

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <Heart className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-slate-900">
              Health Overview
            </h3>
            <p className="text-[11px] font-medium text-slate-600">
              Clinical telemetry and vitals history
            </p>
          </div>
        </div>

        {hasData && (
          <button
            type="button"
            onClick={onAddHealthInfo}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <Plus className="h-3.5 w-3.5 text-slate-500" />
            <span>Update Vitals</span>
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 p-4" />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600 mb-2" />
          <p className="text-sm font-bold text-rose-900">
            Unable to load health vitals.
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
      {!isLoading && !isError && !hasData && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <Heart className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">
            No health data available
          </h4>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Log your blood pressure, heart rate, or recent checkup to monitor your health markers with CareQ AI.
          </p>
          <button
            type="button"
            onClick={onAddHealthInfo}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Health Information</span>
          </button>
        </div>
      )}

      {/* Data State: Vitals Exist */}
      {!isLoading && !isError && hasData && vitals && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {/* Blood Pressure */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-white hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Blood Pressure</span>
              <Activity className="h-4 w-4 text-teal-600" />
            </div>
            {vitals.bloodPressure ? (
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {vitals.bloodPressure.unit}
                  </span>
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 capitalize">
                    {vitals.bloodPressure.status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Not recorded</p>
            )}
          </div>

          {/* Heart Rate */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-white hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Heart Rate</span>
              <Heart className="h-4 w-4 text-rose-500" />
            </div>
            {vitals.heartRate ? (
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {vitals.heartRate.value}{' '}
                  <span className="text-xs font-normal text-slate-500">bpm</span>
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">Resting</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 capitalize">
                    {vitals.heartRate.status || 'Normal'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Not recorded</p>
            )}
          </div>

          {/* Weight */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-white hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Weight</span>
              <Weight className="h-4 w-4 text-sky-500" />
            </div>
            {vitals.weight ? (
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {vitals.weight.value}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    {vitals.weight.unit}
                  </span>
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">Recorded</span>
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800 capitalize">
                    {vitals.weight.status || 'Normal'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Not recorded</p>
            )}
          </div>

          {/* BMI */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-white hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Body Mass Index (BMI)</span>
              <Scale className="h-4 w-4 text-indigo-500" />
            </div>
            {vitals.bmi ? (
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {vitals.bmi.value}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">kg/m²</span>
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 capitalize">
                    {vitals.bmi.status || 'Optimal'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Not recorded</p>
            )}
          </div>

          {/* Last Checkup */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-white hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Last Checkup</span>
              <Calendar className="h-4 w-4 text-emerald-600" />
            </div>
            {vitals.lastCheckup ? (
              <div>
                <p className="text-sm sm:text-base font-bold text-slate-900">
                  {vitals.lastCheckup}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">Annual Wellness Exam</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">None logged</p>
            )}
          </div>

          {/* Next Follow-up */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-white hover:shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Next Follow-up</span>
              <Calendar className="h-4 w-4 text-amber-600" />
            </div>
            {vitals.nextFollowUp ? (
              <div>
                <p className="text-sm sm:text-base font-bold text-slate-900">
                  {vitals.nextFollowUp}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">Cardiovascular Review</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No scheduled follow-up</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
