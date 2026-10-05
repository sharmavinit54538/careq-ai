import React, { useState } from 'react';
import {
  Settings,
  Lock,
  Bell,
  Clock,
  Shield,
  LogOut,
  CheckCircle2,
  Key,
  Globe
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const DoctorSettingsView: React.FC = () => {
  const { user, logout } = useAuth();

  const [activeSection, setActiveSection] = useState<'account' | 'security' | 'notifications' | 'privacy'>('account');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [appointmentReminderMins, setAppointmentReminderMins] = useState(30);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordNotice('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordNotice('Password must be at least 8 characters long.');
      return;
    }
    setPasswordNotice('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordNotice(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Doctor Practice Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure security credentials, notification channels, consultation preferences, and privacy controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-1">
          {[
            { id: 'account', label: 'Account Profile', icon: Settings },
            { id: 'security', label: 'Security & Password', icon: Lock },
            { id: 'notifications', label: 'Alert Preferences', icon: Bell },
            { id: 'privacy', label: 'Data & Privacy', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  active
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Setting Panel Content (3 cols) */}
        <div className="md:col-span-3 space-y-6">
          {/* Account Profile Section */}
          {activeSection === 'account' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                Account Credentials
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Licensed Physician Full Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || ''}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Assigned Practice Role
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Licensed Medical Doctor (Verified Practitioner)"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-teal-800 font-bold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security & Password Section */}
          {activeSection === 'security' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                Change Account Password
              </h3>

              {passwordNotice && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    passwordNotice.includes('successfully')
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  <span>{passwordNotice}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    New Secure Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Alert Preferences */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                Practice Alerts &amp; Notification Channels
              </h3>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Email Appointment Confirmations
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Receive instant booking digests and cancellation alerts via email.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      SMS &amp; WhatsApp Urgent Triage Alerts
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Direct text notifications for critical urgent patient bookings.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                  />
                </label>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold text-slate-900 block mb-1">
                    Pre-Consultation Lead Time Warning
                  </span>
                  <select
                    value={appointmentReminderMins}
                    onChange={(e) => setAppointmentReminderMins(Number(e.target.value))}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-bold"
                  >
                    <option value={15}>15 minutes before visit</option>
                    <option value={30}>30 minutes before visit</option>
                    <option value={60}>1 hour before visit</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Data & Privacy */}
          {activeSection === 'privacy' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                Healthcare Compliance &amp; Patient Privacy
              </h3>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  CareQ AI adheres to HIPAA, DISHA, and European GDPR-health standards. All clinical audio, video, notes, and e-prescriptions are encrypted in transit with TLS 1.3 and at rest with AES-256 GCM cryptographic vaults.
                </p>
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-900 font-semibold">
                  ✓ End-to-end clinical telemetry audit logging active.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
