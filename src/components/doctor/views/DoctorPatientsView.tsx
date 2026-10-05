import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  ChevronRight,
  Phone,
  Mail,
  AlertTriangle,
  Clock,
  Plus,
  ShieldCheck,
  Filter
} from 'lucide-react';
import type { DoctorPatient } from '../../../types/doctor';

interface DoctorPatientsViewProps {
  patients: DoctorPatient[];
  isLoading: boolean;
}

export const DoctorPatientsView: React.FC<DoctorPatientsViewProps> = ({
  patients,
  isLoading
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('all');

  // Extract unique chronic conditions
  const allConditions = Array.from(
    new Set(patients.flatMap((p) => p.medicalHistory))
  );

  const filteredPatients = patients.filter((patient) => {
    if (selectedCondition !== 'all') {
      if (!patient.medicalHistory.some((c) => c.toLowerCase().includes(selectedCondition.toLowerCase()))) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = patient.name.toLowerCase().includes(q);
      const matchPhone = patient.phone.includes(q);
      const matchEmail = patient.email.toLowerCase().includes(q);
      const matchHistory = patient.medicalHistory.some((m) => m.toLowerCase().includes(q));
      if (!matchName && !matchPhone && !matchEmail && !matchHistory) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              My Patient Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized clinical profiles and patient medical histories under your active supervision.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Total Authorized: <strong className="text-slate-900">{patients.length}</strong>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="relative sm:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, medical condition, or allergy..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
            />
          </div>

          <div>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-700 cursor-pointer"
            >
              <option value="all">All Medical Conditions</option>
              {allConditions.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patient Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center">
            <Users size={28} />
          </div>
          <h3 className="font-bold text-slate-800">No patient records found.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or selecting a different condition filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => navigate(`/doctor/patients/${patient.id}`)}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-500/40 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Avatar & Basic Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        patient.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=0d9488&color=fff`
                      }
                      alt={patient.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0 group-hover:border-teal-500 transition-colors"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                        {patient.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {patient.age} yrs &bull; {patient.gender} &bull; Blood:{' '}
                        <strong className="text-teal-700 font-semibold">{patient.bloodGroup}</strong>
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex-shrink-0">
                    {patient.totalVisits} visits
                  </span>
                </div>

                {/* Medical History Tags */}
                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {patient.medicalHistory.slice(0, 2).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {item}
                      </span>
                    ))}
                    {patient.medicalHistory.length > 2 && (
                      <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                        +{patient.medicalHistory.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Allergies Notice */}
                  {patient.allergies.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60 font-medium">
                      <AlertTriangle size={13} className="text-amber-600 flex-shrink-0" />
                      <span className="truncate">Allergy: {patient.allergies.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Details & View CTA */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Last visit: {patient.lastVisitDate}</span>
                <span className="font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  <span>View Record</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
