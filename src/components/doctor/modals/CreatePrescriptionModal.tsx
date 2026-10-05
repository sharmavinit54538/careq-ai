import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Pill, ShieldCheck, AlertCircle } from 'lucide-react';
import type { DoctorPatient, PrescriptionMedicineItem } from '../../../types/doctor';

interface CreatePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: DoctorPatient[];
  initialPatient?: DoctorPatient | null;
  onSavePrescription: (
    patient: DoctorPatient,
    diagnosis: string,
    notes: string,
    medicines: PrescriptionMedicineItem[],
    followUpDate: string,
    status: 'draft' | 'issued'
  ) => Promise<void>;
}

export const CreatePrescriptionModal: React.FC<CreatePrescriptionModalProps> = ({
  isOpen,
  onClose,
  patients,
  initialPatient,
  onSavePrescription
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatient?.id || (patients.length > 0 ? patients[0].id : '')
  );

  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [medicines, setMedicines] = useState<PrescriptionMedicineItem[]>([
    {
      id: 'med_init_1',
      name: '',
      dosage: '',
      frequency: 'Once daily',
      duration: '30 days',
      instructions: 'Take orally after meals.'
    }
  ]);

  useEffect(() => {
    if (initialPatient) {
      setSelectedPatientId(initialPatient.id);
    } else if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [initialPatient, patients]);

  if (!isOpen) return null;

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        id: `med_${Date.now()}`,
        name: '',
        dosage: '',
        frequency: 'Once daily',
        duration: '14 days',
        instructions: ''
      }
    ]);
  };

  const handleRemoveMedicine = (id: string) => {
    if (medicines.length === 1) return;
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleMedicineChange = (id: string, field: keyof PrescriptionMedicineItem, val: string) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  const handleSubmit = async (status: 'draft' | 'issued') => {
    if (!currentPatient) return;
    if (!diagnosis.trim()) {
      alert('Please enter a clinical diagnosis.');
      return;
    }

    const validMeds = medicines.filter((m) => m.name.trim());
    if (validMeds.length === 0) {
      alert('Please specify at least one medication with a valid name.');
      return;
    }

    setIsSubmitting(true);
    await onSavePrescription(
      currentPatient,
      diagnosis,
      clinicalNotes,
      validMeds,
      followUpDate,
      status
    );
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-2xl">
              <Pill size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Create E-Prescription
              </h2>
              <p className="text-xs text-slate-500">
                Official verified prescription with digital cryptographic signing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-6 max-h-[70vh] overflow-y-auto px-1 scrollbar-thin">
          {/* Patient Selection & Allergy Warning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Patient
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 font-bold cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.age}y &bull; Blood: {p.bloodGroup})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Clinical Diagnosis
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Essential Hypertension (ICD-10 I10)"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
              />
            </div>
          </div>

          {/* Patient Allergies Alert */}
          {currentPatient && currentPatient.allergies.length > 0 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
              <span>
                <strong>Patient Allergies:</strong> {currentPatient.allergies.join(', ')}. Avoid prescribing cross-reactive drug classes.
              </span>
            </div>
          )}

          {/* Medicine Rows */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Prescribed Medications
              </span>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-3">
              {medicines.map((med, index) => (
                <div
                  key={med.id}
                  className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Medicine #{index + 1}</span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(med.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                        title="Remove medicine"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        required
                        value={med.name}
                        onChange={(e) => handleMedicineChange(med.id, 'name', e.target.value)}
                        placeholder="e.g. Atorvastatin Calcium"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(med.id, 'dosage', e.target.value)}
                        placeholder="e.g. 20mg"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(med.id, 'frequency', e.target.value)}
                        placeholder="e.g. 1 tablet once daily"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(med.id, 'duration', e.target.value)}
                        placeholder="e.g. 30 days / 90 days"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Special Instructions
                      </label>
                      <input
                        type="text"
                        value={med.instructions || ''}
                        onChange={(e) => handleMedicineChange(med.id, 'instructions', e.target.value)}
                        placeholder="e.g. Take orally at bedtime with full glass of water."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Notes & Follow-up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Clinical Notes / Advice
              </label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Dietary adjustments, physical exercise instructions, or warning signs..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900"
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
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Once issued, this prescription becomes immediately accessible in the patient's verified mobile app and CareQ portal.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck size={16} className="text-teal-600" />
            <span>Authenticated Prescribing Physician</span>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              Save Draft
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('issued')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
            >
              <Pill size={14} />
              <span>{isSubmitting ? 'Signing...' : 'Issue Prescription'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
