import React, { useState } from 'react';
import {
  Search,
  Star,
  Award,
  Clock,
  Calendar,
  Filter
} from 'lucide-react';
import type { DoctorRecommendation } from '../../../types/patient';

interface DoctorsViewProps {
  doctors: DoctorRecommendation[];
  onBookDoctor: (doctor: DoctorRecommendation) => void;
  onViewDoctorProfile: (doctor: DoctorRecommendation) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  doctors,
  onBookDoctor,
  onViewDoctorProfile
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  const specializations = [
    'All',
    'Cardiology & Internal Medicine',
    'Neurology & Cognitive Sciences',
    'General Healthcare',
    'Pediatrics',
    'Orthopedics'
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpec =
      selectedSpecialization === 'All' ||
      doc.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase());

    return matchesSearch && matchesSpec;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
            Find Healthcare Specialists
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and connect with board-certified CareQ AI verified medical doctors.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by doctor name, specialty, or clinic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 shadow-2xs focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-base font-bold text-slate-800">
            No doctors match your search query.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or resetting filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialization('All');
            }}
            className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-teal-400 hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={
                      doc.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        doc.name
                      )}&background=0d9488&color=fff`
                    }
                    alt={doc.name}
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 truncate">
                      {doc.specialization}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {doc.hospitalName}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {doc.rating}
                        <span className="font-normal text-slate-600">
                          ({doc.reviewCount})
                        </span>
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="flex items-center gap-1 text-slate-600 text-[11px]">
                        <Award className="h-3.5 w-3.5 text-slate-400" />
                        {doc.experienceYears} yrs
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-teal-600" />
                  <span>{doc.availability}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onViewDoctorProfile(doc)}
                  className="rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => onBookDoctor(doc)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 active:scale-95 transition-all"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
