import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  FileText,
  Pill,
  Video,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Download,
  Activity
} from 'lucide-react';
import type {
  DoctorPatient,
  DoctorAppointment,
  DoctorPrescription,
  DoctorMedicalRecord
} from '../../../types/doctor';

interface DoctorPatientDetailViewProps {
  patient: DoctorPatient | null;
  appointments: DoctorAppointment[];
  prescriptions: DoctorPrescription[];
  records: DoctorMedicalRecord[];
  isLoading: boolean;
  onStartConsultation: (patient: DoctorPatient) => void;
  onCreatePrescription: (patient: DoctorPatient) => void;
  onAddNote: (patientId: string, diagnosis: string, note: string, followUpDate?: string) => void;
}

export const DoctorPatientDetailView: React.FC<DoctorPatientDetailViewProps> = ({
  patient,
  appointments,
  prescriptions,
  records,
  isLoading,
  onStartConsultation,
  onCreatePrescription,
  onAddNote
}) => {
  const navigate = useNavigate();
  const isApproved = true;

  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'prescriptions' | 'records' | 'appointments'>('overview');
  const [noteDiagnosis, setNoteDiagnosis] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteFollowUp, setNoteFollowUp] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-40 bg-white rounded-2xl p-6 border border-slate-200 animate-pulse" />
        <div className="h-80 bg-white rounded-2xl p-6 border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
        <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl mx-auto flex items-center justify-center">
          <AlertTriangle size={28} />
        </div>
        <h3 className="font-extrabold text-slate-900 text-lg">Patient Record Not Found or Unauthorized</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You are either not authorized to view this patient's medical records or the patient ID does not exist in your clinical directory.
        </p>
        <button
          type="button"
          onClick={() => navigate('/doctor/patients')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Patient Directory</span>
        </button>
      </div>
    );
  }

  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === patient.id);
  const patientRecords = records.filter((r) => r.patientId === patient.id);

  const handleSaveNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setIsSubmittingNote(true);
    await onAddNote(patient.id, noteDiagnosis || 'General Clinical Review', noteContent, noteFollowUp);
    setNoteDiagnosis('');
    setNoteContent('');
    setNoteFollowUp('');
    setIsSubmittingNote(false);
    setShowNoteForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/doctor/patients')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer self-start"
        >
          <ArrowLeft size={16} />
          <span>Back to All Patients</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {isApproved && (
            <button
              type="button"
              onClick={() => onStartConsultation(patient)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Video size={14} />
              <span>Start Consultation</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onCreatePrescription(patient)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Pill size={14} />
            <span>Create Prescription</span>
          </button>
        </div>
      </div>

      {/* Patient Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={
                patient.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=0d9488&color=fff`
              }
              alt={patient.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-sm flex-shrink-0"
            />

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {patient.name}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Patient ID: {patient.id}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Blood Group: {patient.bloodGroup}
                </span>
              </div>

              <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{patient.age} years old</span>
                <span>&bull;</span>
                <span>{patient.gender}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Phone size={12} className="text-teal-600" />
                  {patient.phone}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-teal-600" />
                  {patient.email}
                </span>
              </p>

              {patient.address && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400" />
                  {patient.address}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex-shrink-0">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Visits
              </div>
              <div className="text-xl font-extrabold text-slate-900">{patient.totalVisits}</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Last Consultation
              </div>
              <div className="text-xs font-bold text-teal-700">{patient.lastVisitDate}</div>
            </div>
          </div>
        </div>

        {/* Prominent Allergy & Chronic Alerts */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Allergies Alert */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Documented Allergies
              </div>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">
                {patient.allergies.length > 0 ? patient.allergies.join('; ') : 'No documented drug or food allergies.'}
              </p>
            </div>
          </div>

          {/* Chronic Medical Conditions */}
          <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 flex items-start gap-3">
            <Activity size={18} className="text-sky-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                Active Medical History
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.medicalHistory.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-white text-sky-800 px-2 py-0.5 rounded border border-sky-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Clinical Overview' },
          { id: 'notes', label: `Consultation Notes (${patient.consultationNotes?.length || 0})` },
          { id: 'prescriptions', label: `Prescriptions (${patientPrescriptions.length})` },
          { id: 'records', label: `Medical Reports (${patientRecords.length})` },
          { id: 'appointments', label: `Appointments (${patientAppointments.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 cols): Current Medications & Follow-up Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Medications */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Pill size={18} className="text-teal-600" />
                  <span>Current Active Medications</span>
                </h3>
                <button
                  type="button"
                  onClick={() => onCreatePrescription(patient)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                >
                  + Issue New Rx
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {patient.currentMedications.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No active medications registered.</p>
                ) : (
                  patient.currentMedications.map((med, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        <span className="text-sm font-semibold text-slate-800">{med}</span>
                      </div>
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Active
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Follow-up & Emergency Info */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Clock size={18} className="text-teal-600" />
                <span>Follow-up &amp; Emergency Contacts</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-500 block">
                    Recommended Follow-up Date
                  </span>
                  <span className="text-sm font-bold text-teal-800 mt-1 block">
                    {patient.followUpDate || 'None scheduled'}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-500 block">
                    Emergency Contact Person
                  </span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">
                    {patient.emergencyContact || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Notes Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Latest Doctor Note</h3>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('notes');
                    setShowNoteForm(true);
                  }}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                >
                  + Add Note
                </button>
              </div>

              {patient.consultationNotes && patient.consultationNotes.length > 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200/60">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-700">
                      {patient.consultationNotes[0].doctorName}
                    </span>
                    <span>{patient.consultationNotes[0].date}</span>
                  </div>
                  <div className="text-xs font-bold text-teal-800">
                    Diagnosis: {patient.consultationNotes[0].diagnosis}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{patient.consultationNotes[0].notes}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No consultation notes recorded yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Clinical Consultation Notes</h3>
            <button
              type="button"
              onClick={() => setShowNoteForm((prev) => !prev)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>{showNoteForm ? 'Close Form' : 'Write Clinical Note'}</span>
            </button>
          </div>

          {/* Note Form Drawer / Card */}
          {showNoteForm && (
            <form
              onSubmit={handleSaveNoteSubmit}
              className="bg-white rounded-2xl p-6 border-2 border-teal-500/40 shadow-md space-y-4 animate-in fade-in duration-150"
            >
              <h4 className="font-bold text-sm text-slate-900">Add Clinical Note</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Primary Clinical Diagnosis
                  </label>
                  <input
                    type="text"
                    required
                    value={noteDiagnosis}
                    onChange={(e) => setNoteDiagnosis(e.target.value)}
                    placeholder="e.g. Essential Hypertension / T2DM Review"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={noteFollowUp}
                    onChange={(e) => setNoteFollowUp(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Physician's Consultation Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record symptoms, examination findings, clinical assessment, lab interpretations, and patient instructions..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNote}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmittingNote ? 'Saving Note...' : 'Save Clinical Note'}
                </button>
              </div>
            </form>
          )}

          {/* Notes List */}
          <div className="space-y-4">
            {(!patient.consultationNotes || patient.consultationNotes.length === 0) ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs text-xs text-slate-400">
                No consultation notes registered for this patient yet.
              </div>
            ) : (
              patient.consultationNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{note.doctorName}</span>
                      <span className="text-xs text-slate-400 ml-2">&bull; {note.date}</span>
                    </div>
                    {note.followUpDate && (
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        Follow-up: {note.followUpDate}
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold text-teal-900">
                    Diagnosis: {note.diagnosis}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {note.notes}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Prescription History</h3>
            <button
              type="button"
              onClick={() => onCreatePrescription(patient)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Issue Prescription</span>
            </button>
          </div>

          {patientPrescriptions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs text-xs text-slate-400">
              No prescriptions issued for this patient yet.
            </div>
          ) : (
            patientPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{rx.diagnosis}</span>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Issued on {rx.date} by {rx.doctorName}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      rx.status === 'issued' || rx.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {rx.status}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {rx.medicines.map((med) => (
                    <div key={med.id} className="py-2.5 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{med.name}</div>
                        <div className="text-xs text-slate-500">
                          {med.dosage} &bull; {med.frequency} &bull; {med.duration}
                        </div>
                        {med.instructions && (
                          <div className="text-xs text-teal-800 mt-0.5 italic">
                            Instr: {med.instructions}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Medical Records */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Medical Reports &amp; Imaging</h3>

          {patientRecords.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs text-xs text-slate-400">
              No diagnostic records found for this patient.
            </div>
          ) : (
            patientRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-3 bg-teal-50 text-teal-700 rounded-xl flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{rec.name}</h4>
                    <p className="text-xs text-slate-500 truncate">
                      {rec.category} &bull; {rec.uploadedBy} &bull; {rec.date} ({rec.fileSize})
                    </p>
                    {rec.summary && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                        {rec.summary}
                      </p>
                    )}
                  </div>
                </div>

                <a
                  href={rec.fileUrl || '#'}
                  download
                  onClick={(e) => {
                    if (!rec.fileUrl || rec.fileUrl === '#') {
                      e.preventDefault();
                      alert(`Viewing authorized medical document: ${rec.name}`);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Patient Consultation History</h3>

          {patientAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs text-xs text-slate-400">
              No appointments on record for this patient.
            </div>
          ) : (
            patientAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{apt.type}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      {apt.mode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>Date: <strong>{apt.date}</strong></span>
                    <span>Time: <strong>{apt.time}</strong></span>
                    <span>Status: <strong>{apt.status}</strong></span>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-700">₹{apt.fee}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
