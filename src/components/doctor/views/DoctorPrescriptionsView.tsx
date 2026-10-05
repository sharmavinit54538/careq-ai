import React, { useState } from 'react';
import {
  Pill,
  Search,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  FileText,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import type { DoctorPrescription } from '../../../types/doctor';

interface DoctorPrescriptionsViewProps {
  prescriptions: DoctorPrescription[];
  onOpenCreateModal: () => void;
  onIssueDraft: (prescriptionId: string) => Promise<void>;
  onViewPrescriptionDetails: (prescription: DoctorPrescription) => void;
}

export const DoctorPrescriptionsView: React.FC<DoctorPrescriptionsViewProps> = ({
  prescriptions,
  onOpenCreateModal,
  onIssueDraft,
  onViewPrescriptionDetails
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'issued' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (activeTab === 'issued') {
      if (rx.status !== 'issued' && rx.status !== 'active') return false;
    } else if (activeTab === 'draft') {
      if (rx.status !== 'draft') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPatient = rx.patientName.toLowerCase().includes(q);
      const matchDiagnosis = rx.diagnosis.toLowerCase().includes(q);
      const matchMed = rx.medicines.some((m) => m.name.toLowerCase().includes(q));
      if (!matchPatient && !matchDiagnosis && !matchMed) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & New Prescription CTA */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              E-Prescriptions Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review, edit draft medication regimens, and electronically issue signed prescriptions.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Create Prescription</span>
          </button>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Prescriptions' },
              { id: 'issued', label: 'Issued & Active' },
              { id: 'draft', label: 'Drafts' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient, medicine, diagnosis..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center">
              <Pill size={28} />
            </div>
            <h3 className="font-bold text-slate-800">No prescriptions found.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no prescriptions matching your active filters.
            </p>
          </div>
        ) : (
          filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
                    <Pill size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {rx.patientName} &bull;{' '}
                      <span className="text-teal-700 font-semibold">{rx.diagnosis}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Created on {rx.date} &bull; Dr. {rx.doctorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      rx.status === 'issued' || rx.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {rx.status}
                  </span>

                  {rx.status === 'draft' && (
                    <button
                      type="button"
                      onClick={() => onIssueDraft(rx.id)}
                      className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Issue Signed
                    </button>
                  )}
                </div>
              </div>

              {/* Medicines Summary Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rx.medicines.map((med) => (
                  <div
                    key={med.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1"
                  >
                    <div className="text-xs font-bold text-slate-900">{med.name}</div>
                    <div className="text-[11px] text-slate-600">
                      {med.dosage} &bull; {med.frequency} &bull; {med.duration}
                    </div>
                    {med.instructions && (
                      <div className="text-[11px] text-teal-800 italic truncate">
                        {med.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Clinical Notes & Action */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                <div className="italic truncate max-w-xl">
                  {rx.clinicalNotes ? `Notes: "${rx.clinicalNotes}"` : 'No additional clinical remarks.'}
                </div>

                <button
                  type="button"
                  onClick={() => onViewPrescriptionDetails(rx)}
                  className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer self-end"
                >
                  <span>View Full Slip</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
