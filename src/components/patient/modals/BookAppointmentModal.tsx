import React, { useState } from 'react';
import { X, Calendar, Video, MapPin, Loader2 } from 'lucide-react';
import type { DoctorRecommendation } from '../../../types/patient';


interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: DoctorRecommendation[];
  selectedDoctor?: DoctorRecommendation | null;
  onBookSuccess: (appointment: {
    doctorId: string;
    doctorName: string;
    doctorSpecialization: string;
    doctorAvatar?: string;
    date: string;
    time: string;
    type: 'video' | 'in-person';
    clinicInfo?: string;
    notes?: string;
  }) => Promise<void>;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  doctors,
  selectedDoctor,
  onBookSuccess
}) => {
  const [doctorId, setDoctorId] = useState<string>(
    selectedDoctor?.id || doctors[0]?.id || ''
  );
  const [date, setDate] = useState<string>(
    () => new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [time, setTime] = useState<string>('10:30 AM');
  const [type, setType] = useState<'video' | 'in-person'>('video');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const doc = doctors.find((d) => d.id === doctorId) || selectedDoctor;
    if (!doc) {
      setError('Please select a healthcare professional.');
      return;
    }

    if (!date) {
      setError('Please select an appointment date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onBookSuccess({
        doctorId: doc.id,
        doctorName: doc.name,
        doctorSpecialization: doc.specialization,
        doctorAvatar: doc.avatarUrl,
        date,
        time,
        type,
        clinicInfo:
          type === 'video'
            ? 'CareQ Encrypted Video Room'
            : doc.hospitalName || 'Outpatient Clinic Suite 4B',
        notes: notes.trim() || undefined
      });
      onClose();
    } catch {
      setError('Unable to reserve appointment slot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Book Consultation
              </h3>
              <p className="text-xs text-slate-500">
                Schedule an appointment with a verified healthcare physician
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
          {/* Select Doctor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Doctor / Specialist
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Consultation Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Consultation Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('video')}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 border text-xs font-bold transition-all ${
                  type === 'video'
                    ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Video className="h-4 w-4" />
                <span>Video Telehealth</span>
              </button>

              <button
                type="button"
                onClick={() => setType('in-person')}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 border text-xs font-bold transition-all ${
                  type === 'in-person'
                    ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>In-Person Clinic Visit</span>
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Appointment Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Time Slot
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:45 AM">11:45 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:45 PM">04:45 PM</option>
              </select>
            </div>
          </div>

          {/* Clinical Reason / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Visit / Symptoms (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. routine checkup, heart palpitation follow-up, lab review..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Buttons */}
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
                  <span>Reserving Slot...</span>
                </>
              ) : (
                <span>Confirm Appointment</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
