import React from 'react';
import { Calendar, UserCheck, Sparkles } from 'lucide-react';

interface WelcomeBannerProps {
  patientName: string;
  onBookAppointment: () => void;
  onFindDoctor: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  patientName,
  onBookAppointment,
  onFindDoctor
}) => {
  // Determine time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const greeting = getGreeting();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 sm:p-7 text-white shadow-lg">
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 border border-teal-400/30 px-3 py-1 text-xs font-semibold text-teal-300 mb-3 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            <span>CareQ Clinical Intelligence &bull; AI Health Guard Active</span>
          </div>

          {/* Heading with explicit color for guaranteed crisp white contrast */}
          <h2
            style={{ color: '#ffffff' }}
            className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight"
          >
            {greeting},{' '}
            <span className="bg-gradient-to-r from-teal-300 to-sky-300 bg-clip-text text-transparent">
              {patientName}
            </span>{' '}
            👋
          </h2>

          {/* Subtitle */}
          <p style={{ color: '#cbd5e1' }} className="mt-1.5 text-xs sm:text-sm font-normal leading-relaxed">
            Stay on top of your health and manage your care from one place.
          </p>

          <p style={{ color: '#5eead4' }} className="mt-1 text-[11px] font-medium tracking-wide">
            &ldquo;Smarter Healthcare. Better Care.&rdquo;
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            type="button"
            onClick={onBookAppointment}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 active:scale-95 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <Calendar className="h-4 w-4" />
            <span>Book an Appointment</span>
          </button>

          <button
            type="button"
            onClick={onFindDoctor}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <UserCheck className="h-4 w-4" />
            <span>Find a Doctor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
