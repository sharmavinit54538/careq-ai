import React, { useState } from 'react';
import { X, Heart, Activity, Weight, Loader2 } from 'lucide-react';
import type { HealthVitals } from '../../../types/patient';

interface AddVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVitals: HealthVitals | null;
  onSaveVitals: (vitals: Partial<HealthVitals>) => Promise<void>;
}

export const AddVitalsModal: React.FC<AddVitalsModalProps> = ({
  isOpen,
  onClose,
  currentVitals,
  onSaveVitals
}) => {
  const [systolic, setSystolic] = useState<string>(
    currentVitals?.bloodPressure?.systolic?.toString() || '120'
  );
  const [diastolic, setDiastolic] = useState<string>(
    currentVitals?.bloodPressure?.diastolic?.toString() || '80'
  );
  const [heartRate, setHeartRate] = useState<string>(
    currentVitals?.heartRate?.value?.toString() || '72'
  );
  const [weight, setWeight] = useState<string>(
    currentVitals?.weight?.value?.toString() || '65'
  );
  const [lastCheckup, setLastCheckup] = useState<string>(
    () => currentVitals?.lastCheckup || new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const s = parseInt(systolic, 10);
    const d = parseInt(diastolic, 10);
    const hr = parseInt(heartRate, 10);
    const wt = parseFloat(weight);

    if (isNaN(s) || isNaN(d) || s < 60 || s > 250 || d < 40 || d > 160) {
      setError('Please enter realistic blood pressure readings (e.g. 120 / 80).');
      return;
    }

    if (isNaN(hr) || hr < 40 || hr > 220) {
      setError('Please enter realistic heart rate bpm (40 - 220).');
      return;
    }

    if (isNaN(wt) || wt < 20 || wt > 300) {
      setError('Please enter a valid weight in kg.');
      return;
    }

    // Auto-calculate BMI assuming avg height 1.70m for demo
    const heightM = 1.7;
    const computedBmi = parseFloat((wt / (heightM * heightM)).toFixed(1));

    setIsSubmitting(true);
    try {
      await onSaveVitals({
        bloodPressure: {
          systolic: s,
          diastolic: d,
          unit: 'mmHg',
          status: s < 120 && d < 80 ? 'optimal' : s < 130 && d < 85 ? 'normal' : 'elevated',
          lastUpdated: new Date().toISOString()
        },
        heartRate: {
          value: hr,
          unit: 'bpm',
          status: 'normal',
          lastUpdated: new Date().toISOString()
        },
        weight: {
          value: wt,
          unit: 'kg',
          status: 'normal',
          lastUpdated: new Date().toISOString()
        },
        bmi: {
          value: computedBmi,
          unit: 'kg/m²',
          status: computedBmi < 18.5 ? 'attention' : computedBmi < 25 ? 'optimal' : 'elevated',
          lastUpdated: new Date().toISOString()
        },
        lastCheckup
      });
      onClose();
    } catch {
      setError('Failed to record vitals. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Log Health Vitals
              </h3>
              <p className="text-xs text-slate-500">
                Record official clinical telemetry metrics into your patient chart
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Blood Pressure */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-teal-600" />
              <span>Blood Pressure (Systolic / Diastolic mmHg)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Systolic (120)"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  required
                />
                <span className="text-[10px] text-slate-600 ml-1">Systolic (top)</span>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Diastolic (80)"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  required
                />
                <span className="text-[10px] text-slate-600 ml-1">Diastolic (bottom)</span>
              </div>
            </div>
          </div>

          {/* Heart Rate & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-rose-500" />
                <span>Heart Rate (bpm)</span>
              </label>
              <input
                type="number"
                placeholder="72"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Weight className="h-3.5 w-3.5 text-sky-500" />
                <span>Body Weight (kg)</span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="65.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>
          </div>

          {/* Last Checkup Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Recent Clinical Exam / Checkup Date
            </label>
            <input
              type="date"
              value={lastCheckup}
              onChange={(e) => setLastCheckup(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Vitals...</span>
                </>
              ) : (
                <span>Save Telemetry Vitals</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
