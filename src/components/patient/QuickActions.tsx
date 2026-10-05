import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserSearch,
  CalendarPlus,
  Pill,
  FileCheck2,
  ArrowRight
} from 'lucide-react';

interface QuickActionsProps {
  onBookAppointmentClick?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onBookAppointmentClick }) => {
  const actions = [
    {
      title: 'Find a Doctor',
      description: 'Search and discover verified healthcare specialists.',
      icon: UserSearch,
      to: '/patient/doctors',
      colorBg: 'bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white',
      borderColor: 'hover:border-teal-300'
    },
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation with a doctor online or clinic.',
      icon: CalendarPlus,
      to: '/patient/appointments',
      onClick: onBookAppointmentClick,
      colorBg: 'bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white',
      borderColor: 'hover:border-sky-300'
    },
    {
      title: 'My Prescriptions',
      description: 'View your active prescriptions and refill orders.',
      icon: Pill,
      to: '/patient/prescriptions',
      colorBg: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white',
      borderColor: 'hover:border-emerald-300'
    },
    {
      title: 'Medical Records',
      description: 'Access your clinical documents, lab reports, and imaging.',
      icon: FileCheck2,
      to: '/patient/medical-records',
      colorBg: 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white',
      borderColor: 'hover:border-indigo-300'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-bold text-slate-900">
          Quick Actions
        </h3>
        <span className="text-xs font-medium text-slate-600">
          Frequently used patient workflows
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          const cardContent = (
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-200 ${act.colorBg}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {act.title}
                </h4>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-normal">
                  {act.description}
                </p>
              </div>
            </div>
          );

          return (
            <Link
              key={act.title}
              to={act.to}
              onClick={(e) => {
                if (act.onClick) {
                  e.preventDefault();
                  act.onClick();
                }
              }}
              className={`group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${act.borderColor}`}
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
