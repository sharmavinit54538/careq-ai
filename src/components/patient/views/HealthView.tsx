import React from 'react';
import {
  Heart,
  Activity,
  Weight,
  Scale,
  Calendar,
  Plus,
  ShieldCheck
} from 'lucide-react';
import type { HealthVitals } from '../../../types/patient';

interface HealthViewProps {
  vitals: HealthVitals | null;
  onAddHealthInfo: () => void;
}

export const HealthView: React.FC<HealthViewProps> = ({
  vitals,
  onAddHealthInfo
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
            Health & Clinical Telemetry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time biometric telemetry, blood pressure tracking, and wellness indicators.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddHealthInfo}
          className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Update Vitals</span>
        </button>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Pressure */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              Blood Pressure
            </span>
            <Activity className="h-5 w-5 text-teal-600" />
          </div>
          {vitals?.bloodPressure ? (
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">mmHg</span>
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 capitalize">
                  {vitals.bloodPressure.status}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No readings logged yet.</p>
          )}
        </div>

        {/* Heart Rate */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              Heart Rate (Resting)
            </span>
            <Heart className="h-5 w-5 text-rose-500" />
          </div>
          {vitals?.heartRate ? (
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {vitals.heartRate.value}{' '}
                <span className="text-sm font-normal text-slate-500">bpm</span>
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Normal sinus</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 capitalize">
                  {vitals.heartRate.status || 'Normal'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No readings logged yet.</p>
          )}
        </div>

        {/* Weight */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Weight</span>
            <Weight className="h-5 w-5 text-sky-500" />
          </div>
          {vitals?.weight ? (
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {vitals.weight.value}{' '}
                <span className="text-sm font-normal text-slate-500">
                  {vitals.weight.unit}
                </span>
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Recorded</span>
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800 capitalize">
                  {vitals.weight.status || 'Optimal'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No readings logged yet.</p>
          )}
        </div>

        {/* BMI */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              Body Mass Index
            </span>
            <Scale className="h-5 w-5 text-indigo-500" />
          </div>
          {vitals?.bmi ? (
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {vitals.bmi.value}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">kg/m²</span>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 capitalize">
                  {vitals.bmi.status || 'Optimal'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No readings logged yet.</p>
          )}
        </div>
      </div>

      {/* Clinical Verification Banner */}
      <div className="rounded-3xl border border-teal-200 bg-teal-50/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white flex-shrink-0 mt-0.5">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-900">
              Physician-Reviewed Telemetry Sync
            </h3>
            <p className="text-xs text-teal-800 mt-1 max-w-xl">
              All logged biometric vitals are synchronized directly with Dr. Evelyn Reed and your designated care team. Any sudden abnormalities trigger automated doctor notification flags.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddHealthInfo}
          className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-teal-900 border border-teal-300 shadow-2xs hover:bg-teal-50 self-start sm:self-auto"
        >
          Record Entry
        </button>
      </div>

      {/* Exam Timeline Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Last Wellness Exam</h3>
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            {vitals?.lastCheckup || 'None logged'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Mount Sinai Comprehensive Cardiovascular Health Check
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Next Recommended Follow-up</h3>
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            {vitals?.nextFollowUp || 'October 15, 2026'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Bi-annual Lipid and Electrolyte Assessment
          </p>
        </div>
      </div>
    </div>
  );
};
