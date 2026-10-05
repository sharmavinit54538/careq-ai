import React, { useState } from 'react';
import {
  Bell,
  Lock,
  Globe,
  CheckCircle2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [labAlerts, setLabAlerts] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
          Account & Portal Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your notification preferences, telehealth security settings, and communication options.
        </p>
      </div>

      {savedNotice && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      {/* Notifications Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Bell className="h-5 w-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900">
            Clinical Notification Preferences
          </h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-bold text-slate-800">Email Appointment Reminders</p>
              <p className="text-xs text-slate-500">
                Receive email alerts 24 hours and 1 hour before scheduled consultations.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-5 w-5 rounded text-teal-600 focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-bold text-slate-800">SMS Telehealth Link Delivery</p>
              <p className="text-xs text-slate-500">
                Receive direct video room access links via encrypted SMS text message.
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="h-5 w-5 rounded text-teal-600 focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-bold text-slate-800">Diagnostic & Lab Result Alerts</p>
              <p className="text-xs text-slate-500">
                Get notified immediately when lab technicians upload new diagnostic panels.
              </p>
            </div>
            <input
              type="checkbox"
              checked={labAlerts}
              onChange={(e) => setLabAlerts(e.target.checked)}
              className="h-5 w-5 rounded text-teal-600 focus:ring-teal-500"
            />
          </label>
        </div>
      </div>

      {/* Security & Access */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Lock className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Privacy & HIPAA Access Control
          </h3>
        </div>

        <div className="space-y-4 text-xs text-slate-600">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50">
            <div>
              <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Protect patient medical records with SMS or Authenticator verification.
              </p>
            </div>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50">
            <div>
              <p className="font-bold text-slate-900">Encrypted Cloud Storage</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                AES-256 Bit zero-knowledge patient encryption enabled.
              </p>
            </div>
            <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[11px] font-bold text-teal-800">
              Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Language & Regional */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Globe className="h-5 w-5 text-sky-600" />
          <h3 className="text-base font-bold text-slate-900">
            Regional Preferences
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Portal Language
            </label>
            <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800">
              <option>English (United States)</option>
              <option>Spanish (Español)</option>
              <option>French (Français)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Timezone
            </label>
            <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800">
              <option>Eastern Time (US & Canada)</option>
              <option>Central Time (US & Canada)</option>
              <option>Pacific Time (US & Canada)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-2xl bg-teal-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
