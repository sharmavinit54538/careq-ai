import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Video,
  User,
  ShieldAlert,
  Plus,
  Trash2
} from 'lucide-react';
import type { DoctorScheduleConfig, DoctorScheduleDay } from '../../../types/doctor';

interface DoctorScheduleViewProps {
  schedule: DoctorScheduleConfig;
  onSaveSchedule: (newSchedule: DoctorScheduleConfig) => Promise<void>;
}

export const DoctorScheduleView: React.FC<DoctorScheduleViewProps> = ({
  schedule: initialSchedule,
  onSaveSchedule
}) => {
  const [schedule, setSchedule] = useState<DoctorScheduleConfig>(initialSchedule);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [holidayInput, setHolidayInput] = useState('');

  const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const handleDayToggle = (day: typeof days[number]) => {
    setSchedule((prev) => ({
      ...prev,
      weekly: {
        ...prev.weekly,
        [day]: {
          ...prev.weekly[day],
          available: !prev.weekly[day].available
        }
      }
    }));
  };

  const handleTimeChange = (
    day: typeof days[number],
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      weekly: {
        ...prev.weekly,
        [day]: {
          ...prev.weekly[day],
          [field]: value
        }
      }
    }));
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayInput.trim()) return;
    if (!schedule.holidays.includes(holidayInput.trim())) {
      setSchedule((prev) => ({
        ...prev,
        holidays: [...prev.holidays, holidayInput.trim()]
      }));
    }
    setHolidayInput('');
  };

  const handleRemoveHoliday = (h: string) => {
    setSchedule((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((date) => date !== h)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSaveSchedule(schedule);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Schedule &amp; Clinical Availability
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure consultation office hours, break intervals, telemedicine availability, and upcoming leaves.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60 self-start sm:self-auto"
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save Availability'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={18} />
          <span>Your practice availability and consultation hours have been successfully updated!</span>
        </div>
      )}

      {/* General Consultation Preferences & Modalities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Slot Duration */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Clock size={18} className="text-teal-600" />
            <span>Consultation Duration</span>
          </div>
          <p className="text-xs text-slate-500">
            Standard time allocated per patient booking.
          </p>
          <select
            value={schedule.consultationDuration}
            onChange={(e) =>
              setSchedule((prev) => ({
                ...prev,
                consultationDuration: Number(e.target.value)
              }))
            }
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-bold cursor-pointer"
          >
            <option value={15}>15 Minutes per slot</option>
            <option value={20}>20 Minutes per slot (Recommended)</option>
            <option value={30}>30 Minutes per slot</option>
            <option value={45}>45 Minutes per slot</option>
          </select>
        </div>

        {/* Card 2: Consultation Types */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Video size={18} className="text-teal-600" />
            <span>Consultation Channels</span>
          </div>
          <p className="text-xs text-slate-500">
            Select patient booking channels to offer.
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={schedule.allowOnline}
                onChange={(e) =>
                  setSchedule((prev) => ({ ...prev, allowOnline: e.target.checked }))
                }
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <span>Online Video / Telehealth</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={schedule.allowInPerson}
                onChange={(e) =>
                  setSchedule((prev) => ({ ...prev, allowInPerson: e.target.checked }))
                }
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <span>In-Person Hospital Clinic</span>
            </label>
          </div>
        </div>

        {/* Card 3: Emergency Availability */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldAlert size={18} className="text-teal-600" />
            <span>Emergency / Urgent Triage</span>
          </div>
          <p className="text-xs text-slate-500">
            Allow hospital triage staff to book urgent priority slots.
          </p>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={schedule.emergencyAvailable}
              onChange={(e) =>
                setSchedule((prev) => ({
                  ...prev,
                  emergencyAvailable: e.target.checked
                }))
              }
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <span>Accept Emergency Consultations</span>
          </label>
        </div>
      </div>

      {/* Weekly Schedule Days (Monday - Sunday) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
          Weekly Recurring Hours (Monday – Sunday)
        </h3>

        <div className="divide-y divide-slate-100">
          {days.map((day) => {
            const dayConfig = schedule.weekly[day] || {
              available: false,
              startTime: '09:00 AM',
              endTime: '05:00 PM',
              breaks: []
            };

            return (
              <div
                key={day}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Day name & toggle */}
                <div className="flex items-center gap-3 w-44 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      dayConfig.available ? 'bg-teal-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        dayConfig.available ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm font-bold ${
                      dayConfig.available ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {day}
                  </span>
                </div>

                {/* Status & Times */}
                {dayConfig.available ? (
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">From:</span>
                      <input
                        type="text"
                        value={dayConfig.startTime}
                        onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                        placeholder="09:00 AM"
                        className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl w-28 text-slate-800 font-bold"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">To:</span>
                      <input
                        type="text"
                        value={dayConfig.endTime}
                        onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                        placeholder="08:00 PM"
                        className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl w-28 text-slate-800 font-bold"
                      />
                    </div>

                    {dayConfig.breaks && dayConfig.breaks.length > 0 && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        Break: {dayConfig.breaks[0].start} – {dayConfig.breaks[0].end}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 text-xs text-slate-400 italic">
                    Off / Clinic Closed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Holidays & Leaves Management */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
          Holidays &amp; Scheduled Leaves
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md">
          <input
            type="date"
            value={holidayInput}
            onChange={(e) => setHolidayInput(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          />
          <button
            type="button"
            onClick={handleAddHoliday}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Holiday Date</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {schedule.holidays.length === 0 ? (
            <span className="text-xs text-slate-400">No scheduled leaves marked.</span>
          ) : (
            schedule.holidays.map((h) => (
              <span
                key={h}
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200"
              >
                <span>{h}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveHoliday(h)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 size={13} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </form>
  );
};
