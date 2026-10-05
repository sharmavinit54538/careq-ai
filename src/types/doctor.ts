export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'pending';

export type ConsultationMode = 'video' | 'in-person' | 'audio';

export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  patientEmail?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM"
  type: 'General Consultation' | 'Follow-up' | 'Routine Checkup' | 'Emergency' | 'Specialist Review';
  mode: ConsultationMode;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  meetingLink?: string;
  clinicRoom?: string;
  fee: number;
  createdAt: string;
}

export interface ConsultationNoteRecord {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  notes: string;
  followUpDate?: string;
}

export interface DoctorPatient {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  address?: string;
  emergencyContact?: string;
  lastVisitDate: string;
  lastAppointmentType: string;
  totalVisits: number;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  consultationNotes: ConsultationNoteRecord[];
  followUpDate?: string;
}

export interface PrescriptionMedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export type PrescriptionStatus = 'draft' | 'issued' | 'active' | 'discontinued';

export interface DoctorPrescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  date: string;
  status: PrescriptionStatus;
  diagnosis: string;
  clinicalNotes?: string;
  medicines: PrescriptionMedicineItem[];
  followUpDate?: string;
  issuedAt?: string;
  createdAt: string;
}

export type MedicalRecordCategory =
  | 'Lab Reports'
  | 'Imaging'
  | 'Prescriptions'
  | 'Doctor Notes'
  | 'Discharge Summary'
  | 'Other Documents';

export interface DoctorMedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  name: string;
  category: MedicalRecordCategory;
  date: string;
  uploadedBy: string;
  fileSize: string;
  fileUrl?: string;
  summary?: string;
}

export interface DoctorScheduleDay {
  available: boolean;
  startTime: string;
  endTime: string;
  breaks: Array<{ start: string; end: string }>;
}

export interface DoctorScheduleConfig {
  weekly: {
    Monday: DoctorScheduleDay;
    Tuesday: DoctorScheduleDay;
    Wednesday: DoctorScheduleDay;
    Thursday: DoctorScheduleDay;
    Friday: DoctorScheduleDay;
    Saturday: DoctorScheduleDay;
    Sunday: DoctorScheduleDay;
  };
  consultationDuration: number; // in minutes (e.g. 20)
  allowOnline: boolean;
  allowInPerson: boolean;
  emergencyAvailable: boolean;
  holidays: string[];
  leaveDates: string[];
}

export interface DoctorEarningsTransaction {
  id: string;
  date: string;
  patientName: string;
  patientId: string;
  appointmentRef: string;
  consultationType: string;
  amount: number;
  status: 'paid' | 'pending' | 'refunded';
}

export interface DoctorEarnings {
  todayEarnings: number;
  thisWeekEarnings: number;
  thisMonthEarnings: number;
  totalEarnings: number;
  pendingPayout: number;
  transactions: DoctorEarningsTransaction[];
}

export interface DoctorAnalytics {
  totalAppointments: number;
  completedConsultations: number;
  cancelledAppointments: number;
  newPatients: number;
  returningPatients: number;
  completionRate: number;
  avgConsultationsPerDay: number;
  totalRevenue: number;
  weeklyTrends: Array<{ day: string; count: number; completed: number }>;
  typeDistribution: { video: number; inPerson: number; audio: number };
  monthlyRevenue: Array<{ month: string; amount: number }>;
}

export type DoctorNotificationType =
  | 'appointment_request'
  | 'reminder'
  | 'cancellation'
  | 'report_uploaded'
  | 'prescription_update'
  | 'payment_received'
  | 'admin_message';

export interface DoctorNotification {
  id: string;
  type: DoctorNotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  patientId?: string;
}

export interface DoctorDashboardStats {
  todayAppointmentsCount: number;
  totalPatientsCount: number;
  pendingRequestsCount: number;
  todayEarningsAmount: number;
}
