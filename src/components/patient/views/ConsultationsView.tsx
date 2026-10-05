import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, MessageSquare, PhoneOff } from 'lucide-react';
import type { Appointment } from '../../../types/patient';

interface ConsultationsViewProps {
  activeAppointment?: Appointment | null;
  onLeaveRoom?: () => void;
}

export const ConsultationsView: React.FC<ConsultationsViewProps> = ({
  activeAppointment,
  onLeaveRoom
}) => {
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'Dr. Evelyn Reed',
      text: 'Good day Sarah! Reviewing your recent metabolic panel results now. How have you been feeling since starting the 20mg Atorvastatin?',
      time: '10:31 AM'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: 'You',
        text: chatMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Main Video Call Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video Stage (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video w-full rounded-3xl bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center border border-slate-800">
            {/* Remote Doctor Feed Simulation */}
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200"
              alt="Dr. Evelyn Reed"
              className="h-full w-full object-cover opacity-90"
            />

            {/* Doctor Info Overlay */}
            <div className="absolute top-4 left-4 rounded-xl bg-slate-900/80 px-3 py-1.5 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeAppointment?.doctorName || 'Dr. Evelyn Reed'}</span>
              <span className="text-[10px] text-teal-300 font-normal">
                (Cardiology & Internal Medicine)
              </span>
            </div>

            {/* Patient Self Video PiP Thumbnail */}
            <div className="absolute bottom-4 right-4 h-28 w-40 sm:h-36 sm:w-52 rounded-2xl bg-slate-900 border-2 border-white/20 shadow-xl overflow-hidden">
              {!videoOff ? (
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
                  alt="Patient Video"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs text-slate-400 font-bold">
                  Camera Off
                </div>
              )}
              <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                You
              </span>
            </div>
          </div>

          {/* Media Controls Bar */}
          <div className="flex items-center justify-center gap-4 rounded-2xl bg-white border border-slate-200 p-4 shadow-xs">
            <button
              type="button"
              onClick={() => setMicMuted(!micMuted)}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold transition-all ${
                micMuted
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={micMuted ? 'Unmute' : 'Mute'}
            >
              {micMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={() => setVideoOff(!videoOff)}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold transition-all ${
                videoOff
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={videoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {videoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={onLeaveRoom}
              className="flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition-all"
            >
              <PhoneOff className="h-4 w-4" />
              <span>Leave Consultation</span>
            </button>
          </div>
        </div>

        {/* Right: Clinical In-Call Messaging (1 column) */}
        <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-xs h-[520px]">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Session Live Notes & Messages
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl text-xs ${
                  m.sender === 'You'
                    ? 'bg-teal-50 text-teal-900 border border-teal-100 ml-4'
                    : 'bg-slate-50 text-slate-800 border border-slate-100 mr-4'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>{m.sender}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{m.time}</span>
                </div>
                <p className="leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Type message to doctor..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
