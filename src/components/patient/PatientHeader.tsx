import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  CheckCircle2,
  Calendar,
  X,
  Sun,
  Moon,
  Pill,
  FileText,
  ArrowRight
} from 'lucide-react';
import { GeminiIcon } from '../common/GeminiIcon';
import { useTheme } from '../../context/ThemeContext';
import type {
  PatientNotification,
  DoctorRecommendation,
  Prescription,
  MedicalRecord
} from '../../types/patient';

interface PatientHeaderProps {
  pageTitle?: string;
  onOpenMobileSidebar?: () => void;
  notifications?: PatientNotification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  doctors?: DoctorRecommendation[];
  prescriptions?: Prescription[];
  records?: MedicalRecord[];
}

const COMMON_SYMPTOMS = [
  { name: 'Chest Pain or Palpitations', spec: 'Cardiology' },
  { name: 'Headache & Migraine', spec: 'Neurology' },
  { name: 'High Blood Pressure', spec: 'Cardiology' },
  { name: 'Fever & Flu Symptoms', spec: 'General Healthcare' },
  { name: 'Cholesterol & Lipid Check', spec: 'Internal Medicine' },
  { name: 'Joint Pain & Arthritis', spec: 'Orthopedics' },
  { name: 'Skin Rash & Allergies', spec: 'General Healthcare' }
];

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  onOpenMobileSidebar,
  notifications = [],
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  doctors = [],
  prescriptions = [],
  records = []
}) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const q = searchQuery.trim().toLowerCase();

  const matchingDoctors = q
    ? doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.hospitalName.toLowerCase().includes(q)
      )
    : [];

  const matchingPrescriptions = q
    ? prescriptions.filter(
        (p) =>
          p.medicineName.toLowerCase().includes(q) ||
          p.doctorName.toLowerCase().includes(q) ||
          p.dosage.toLowerCase().includes(q)
      )
    : [];

  const matchingRecords = q
    ? records.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.uploadedBy && r.uploadedBy.toLowerCase().includes(q))
      )
    : [];

  const matchingSymptoms = q
    ? COMMON_SYMPTOMS.filter(
        (s) => s.name.toLowerCase().includes(q) || s.spec.toLowerCase().includes(q)
      )
    : [];

  // Close dropdown on click outside or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      navigate(`/patient/doctors?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
    }
  };

  const handleSelectDoctor = (doctorName: string) => {
    setIsDropdownOpen(false);
    setShowSearchModal(false);
    navigate(`/patient/doctors?search=${encodeURIComponent(doctorName)}`);
  };

  const handleSelectPrescription = () => {
    setIsDropdownOpen(false);
    setShowSearchModal(false);
    navigate('/patient/prescriptions');
  };

  const handleSelectRecord = () => {
    setIsDropdownOpen(false);
    setShowSearchModal(false);
    navigate('/patient/medical-records');
  };

  const handleAskQAI = (promptText: string) => {
    setIsDropdownOpen(false);
    setShowSearchModal(false);
    navigate('/patient/ai-assistant', { state: { initialPrompt: promptText } });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-8 backdrop-blur-md">
      {/* Left: Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="inline-flex lg:hidden items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Right Controls: Search, Notifications, Messages, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Desktop Search Bar with Live Suggestions */}
        <div ref={searchContainerRef} className="relative hidden md:block">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search doctors, records, or symptoms..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsDropdownOpen(true);
              }}
              style={{ paddingLeft: '2.5rem' }}
              className="w-64 lg:w-80 rounded-full border border-slate-200 bg-slate-50/90 pl-10 pr-8 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsDropdownOpen(false);
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Live Search Suggestions Dropdown */}
          {isDropdownOpen && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 top-full mt-2 w-80 lg:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 animate-fade-in divide-y divide-slate-100 max-h-[440px] overflow-y-auto">
              {/* Quick QAI Action */}
              <div className="pb-2">
                <button
                  type="button"
                  onClick={() => handleAskQAI(searchQuery.trim())}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-sky-50 hover:from-teal-100/70 hover:to-sky-100/70 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs flex-shrink-0">
                    <GeminiIcon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700 truncate">
                      Ask QAI: "{searchQuery}"
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      Instant clinical insights & health guidance
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              </div>

              {/* Matching Doctors */}
              {matchingDoctors.length > 0 && (
                <div className="py-2 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                    Verified Doctors ({matchingDoctors.length})
                  </p>
                  {matchingDoctors.slice(0, 3).map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleSelectDoctor(doc.name)}
                      className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <img
                        src={doc.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0d9488&color=fff`}
                        alt={doc.name}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                        <p className="text-[10px] text-teal-600 font-medium truncate">
                          {doc.specialization} &bull; {doc.hospitalName}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        ★ {doc.rating}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Matching Prescriptions */}
              {matchingPrescriptions.length > 0 && (
                <div className="py-2 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                    Prescriptions ({matchingPrescriptions.length})
                  </p>
                  {matchingPrescriptions.slice(0, 2).map((rx) => (
                    <button
                      key={rx.id}
                      type="button"
                      onClick={handleSelectPrescription}
                      className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700 flex-shrink-0">
                        <Pill className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{rx.medicineName}</p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {rx.dosage} &bull; Dr. {rx.doctorName}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Matching Records */}
              {matchingRecords.length > 0 && (
                <div className="py-2 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                    Medical Records ({matchingRecords.length})
                  </p>
                  {matchingRecords.slice(0, 2).map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={handleSelectRecord}
                      className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 flex-shrink-0">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{rec.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {rec.category} &bull; {rec.date}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Matching Symptoms */}
              {matchingSymptoms.length > 0 && (
                <div className="py-2 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                    Symptoms & Topics ({matchingSymptoms.length})
                  </p>
                  {matchingSymptoms.slice(0, 2).map((sym, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectDoctor(sym.spec)}
                      className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-medium text-slate-800">{sym.name}</span>
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                        Find {sym.spec}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* View All */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                >
                  View all doctors matching "{searchQuery}" &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={() => setShowSearchModal(true)}
          className="flex md:hidden h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Open Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Theme Toggle (Light / Night Mode) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" />
          )}
        </button>

        {/* Consultations / Messages Quick Link */}
        <Link
          to="/patient/consultations"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          title="Teleconsultations & Messages"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-teal-500" />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && onMarkAllNotificationsAsRead && (
                  <button
                    type="button"
                    onClick={onMarkAllNotificationsAsRead}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-600">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationAsRead?.(notif.id)}
                      className={`pt-2 flex items-start gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                        notif.isRead ? 'hover:bg-slate-50' : 'bg-teal-50/50 hover:bg-teal-50'
                      }`}
                    >
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        {notif.type === 'reminder' ? (
                          <Calendar className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                <Link
                  to="/patient/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700"
                >
                  View All Notifications &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile is accessible via the sidebar */}
      </div>

      {/* Mobile Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl mt-16 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Search CareQ AI</h3>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Doctor name, cardiology, prescriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
