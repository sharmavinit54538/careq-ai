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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 sm:p-8 lg:p-10 text-white shadow-xl">
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 border border-teal-400/30 px-3.5 py-1 text-xs font-semibold text-teal-300 mb-4 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            <span>CareQ Clinical Intelligence &bull; AI Health Guard Active</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-white">
            {greeting}, {patientName} 👋
          </h2>

          {/* Subtitle */}
          <p className="mt-2 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Stay on top of your health and manage your care from one place.
          </p>

          <p className="mt-1 text-xs text-teal-200/80 font-medium">
            "Smarter Healthcare. Better Care."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            type="button"
            onClick={onBookAppointment}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/25 hover:bg-teal-400 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Calendar className="h-4 w-4" />
            <span>Book an Appointment</span>
          </button>

          <button
            type="button"
            onClick={onFindDoctor}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3 text-sm font-bold text-white hover:bg-white/20 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <UserCheck className="h-4 w-4" />
            <span>Find a Doctor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
