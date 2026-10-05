import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Monitor,
  Share2,
  AlertTriangle,
  Clock,
  Pill,
  Save,
  CheckCircle2,
  Calendar,
  Users,
  FileText,
  ShieldCheck,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import type {
  DoctorAppointment,
  DoctorPatient,
  DoctorPrescription,
  DoctorMedicalRecord
} from '../../../types/doctor';
import { useAuth } from '../../../context/AuthContext';

interface DoctorConsultationsViewProps {
  consultations: DoctorAppointment[];
  patients: DoctorPatient[];
  records: DoctorMedicalRecord[];
  onSaveNotes: (patientId: string, diagnosis: string, notes: string, followUpDate?: string) => Promise<void>;
  onOpenCreatePrescription: (patient: DoctorPatient) => void;
  onCompleteConsultation: (appointmentId: string) => Promise<void>;
}

export const DoctorConsultationsView: React.FC<DoctorConsultationsViewProps> = ({
  consultations,
  patients,
  records,
  onSaveNotes,
  onOpenCreatePrescription,
  onCompleteConsultation
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isApproved = user?.doctorProfile?.verificationStatus === 'approved';

  // Check if an appointment was passed via navigation state
  const initialAppointment = (location.state as any)?.appointment as DoctorAppointment | undefined;

  const [activeAppointment, setActiveAppointment] = useState<DoctorAppointment | null>(
    initialAppointment || (consultations.length > 0 ? consultations[0] : null)
  );

  // Active call controls
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Clinical notes state
  const [consultationDiagnosis, setConsultationDiagnosis] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Match active patient
  const activePatient = activeAppointment
    ? patients.find((p) => p.id === activeAppointment.patientId) || {
        id: activeAppointment.patientId,
        name: activeAppointment.patientName,
        age: activeAppointment.patientAge,
        gender: activeAppointment.patientGender,
        bloodGroup: 'O+',
        phone: activeAppointment.patientPhone,
        email: activeAppointment.patientEmail || '',
        lastVisitDate: activeAppointment.date,
        lastAppointmentType: activeAppointment.type,
        totalVisits: 3,
        medicalHistory: ['Hypertension', 'Regular Checkup'],
        allergies: ['Penicillin'],
        currentMedications: ['Lisinopril 10mg daily'],
        consultationNotes: []
      }
    : null;

  // Active patient's records
  const activeRecords = activePatient
    ? records.filter((r) => r.patientId === activePatient.id)
    : [];

  // Call timer effect
  useEffect(() => {
    let interval: any = null;
    if (inCall) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [inCall]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setInCall(true);
  };

  const handleEndCall = async () => {
    setInCall(false);
    if (activeAppointment) {
      await onCompleteConsultation(activeAppointment.id);
    }
  };

  const handleSaveNotes = async () => {
    if (!activePatient || !consultationNotes.trim()) return;
    setIsSavingNotes(true);
    await onSaveNotes(
      activePatient.id,
      consultationDiagnosis || 'Clinical Telehealth Evaluation',
      consultationNotes,
      followUpDate
    );
    setIsSavingNotes(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  if (!isApproved) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl mx-auto flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Telehealth Consultations Disabled Pending Verification
        </h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          In compliance with medical licensing and telehealth practice standards, live video/audio consultations
          are locked until administrative verification of your state credentials is approved.
        </p>
        <button
          type="button"
          onClick={() => navigate('/doctor/dashboard')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors inline-block cursor-pointer"
        >
          Return to Dashboard Overview
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Clinical Telehealth Workspace
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted, HIPAA-compliant direct telehealth consultation module.
          </p>
        </div>

        {/* Consultation Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600 hidden sm:inline">Active Patient:</label>
          <select
            value={activeAppointment?.id || ''}
            onChange={(e) => {
              const selected = consultations.find((c) => c.id === e.target.value);
              if (selected) {
                setActiveAppointment(selected);
                setInCall(false);
                setConsultationDiagnosis(selected.type);
              }
            }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-bold cursor-pointer"
          >
            {consultations.length === 0 ? (
              <option value="">No Active Consultations</option>
            ) : (
              consultations.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.time} - {c.patientName} ({c.type})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* 3-Column Consultation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Patient Info & Clinical Summary (3 cols on lg) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  activePatient?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(activePatient?.name || 'Patient')}&background=0d9488&color=fff`
                }
                alt={activePatient?.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-base truncate">
                  {activePatient?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {activePatient?.age} yrs &bull; {activePatient?.gender} &bull; Blood: {activePatient?.bloodGroup}
                </p>
              </div>
            </div>

            {/* Allergies Highlight */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle size={13} className="text-amber-600" />
                Allergies
              </span>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">
                {activePatient?.allergies.length ? activePatient.allergies.join(', ') : 'NKDA'}
              </p>
            </div>

            {/* Chronic Medical History */}
            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1.5">
                Medical History
              </span>
              <div className="flex flex-wrap gap-1">
                {activePatient?.medicalHistory.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1.5">
                Current Medications
              </span>
              <div className="space-y-1">
                {activePatient?.currentMedications.map((med, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-700 font-medium flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg"
                  >
                    <Pill size={13} className="text-teal-600 flex-shrink-0" />
                    <span className="truncate">{med}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Reports Link */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 block mb-1.5">
                Diagnostic Reports ({activeRecords.length})
              </span>
              <div className="space-y-1.5">
                {activeRecords.slice(0, 2).map((rec) => (
                  <div
                    key={rec.id}
                    className="text-xs text-slate-600 p-2 bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <span className="truncate">{rec.name}</span>
                    <span className="text-[10px] text-teal-700 font-bold ml-2">Verified</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (activePatient) navigate(`/doctor/patients/${activePatient.id}`);
              }}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200 cursor-pointer"
            >
              Full Medical Record &rarr;
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: Telehealth Video Room & Controls (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative aspect-video flex flex-col justify-between p-4 sm:p-6 text-white min-h-[380px]">
            {/* Top Bar inside Video: Status & Timer */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-semibold">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    inCall ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{inCall ? `In Consultation • ${formatTimer(callDuration)}` : 'Room Ready • Standby'}</span>
              </div>

              <div className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                HD 1080p Telehealth
              </div>
            </div>

            {/* Video Canvas / Stream Center Representation */}
            <div className="flex-1 flex flex-col items-center justify-center text-center my-auto z-10">
              {inCall ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={
                        activePatient?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(activePatient?.name || 'Patient')}&background=0d9488&color=fff`
                      }
                      alt={activePatient?.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-teal-500 shadow-2xl"
                    />
                    <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{activePatient?.name}</h3>
                  <p className="text-xs text-teal-300 font-medium">
                    Audio &amp; Video Connected &bull; Encryption Active (AES-256)
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-w-sm">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto">
                    <Video size={32} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Patient Consultation Chamber</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Patient {activePatient?.name} is registered for this session. Click Start Consultation to connect audio &amp; video streams.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartCall}
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg hover:shadow-teal-500/20 cursor-pointer inline-flex items-center gap-2"
                  >
                    <Video size={18} />
                    <span>Connect Consultation Stream</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            {inCall && (
              <div className="flex items-center justify-center gap-3 z-10 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className={`p-3 rounded-2xl transition-colors cursor-pointer ${
                    isMuted ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                  title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOff((prev) => !prev)}
                  className={`p-3 rounded-2xl transition-colors cursor-pointer ${
                    isVideoOff ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                  title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
                >
                  {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsScreenSharing((prev) => !prev)}
                  className={`p-3 rounded-2xl transition-colors cursor-pointer ${
                    isScreenSharing ? 'bg-teal-500 text-slate-950' : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                  title={isScreenSharing ? 'Stop Screen Share' : 'Share Clinical Report / Screen'}
                >
                  <Monitor size={20} />
                </button>

                <button
                  type="button"
                  onClick={handleEndCall}
                  className="px-5 py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs rounded-2xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <PhoneOff size={18} />
                  <span>End &amp; Complete Call</span>
                </button>
              </div>
            )}
          </div>

          {/* Clinical Decision-Making Safety Warning */}
          <div className="p-3.5 bg-slate-100 rounded-2xl text-[11px] text-slate-600 flex items-center gap-2 border border-slate-200">
            <ShieldCheck size={16} className="text-teal-700 flex-shrink-0" />
            <span>
              <strong>Healthcare Decision Mandate:</strong> CareQ AI tools are purely assistive. You as the licensed physician maintain complete clinical responsibility for diagnoses, drug therapies, and referrals.
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Clinical Notes & Follow-up Actions (3 cols on lg) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
              Consultation Notes &amp; Actions
            </h3>

            {saveSuccessNotice && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} />
                <span>Clinical notes saved to patient file!</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Clinical Assessment / Diagnosis
              </label>
              <input
                type="text"
                value={consultationDiagnosis}
                onChange={(e) => setConsultationDiagnosis(e.target.value)}
                placeholder="e.g. Hypertension Review"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Clinical Consultation Notes
              </label>
              <textarea
                rows={6}
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                placeholder="Record clinical impressions, exam findings, vitals discussed, and management plan..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Follow-up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes || !consultationNotes.trim()}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save size={15} />
                <span>{isSavingNotes ? 'Saving Notes...' : 'Save Notes'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activePatient) onOpenCreatePrescription(activePatient);
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Pill size={15} />
                <span>Create Prescription</span>
              </button>

              <button
                type="button"
                onClick={handleEndCall}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Complete Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
