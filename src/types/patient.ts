export type AppointmentType = 'video' | 'in-person';

export type AppointmentStatus = 'upcoming' | 'confirmed' | 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatar?: string;
  date: string; // ISO date string or formatted (YYYY-MM-DD)
  time: string; // e.g. "10:30 AM"
  type: AppointmentType;
  status: AppointmentStatus;
  clinicInfo?: string;
  meetingLink?: string;
  notes?: string;
}

export interface VitalRecord<T = number> {
  value: T;
  unit: string;
  status?: 'optimal' | 'normal' | 'elevated' | 'high' | 'attention';
  lastUpdated: string;
}

export interface BloodPressureVital {
  systolic: number;
  diastolic: number;
  unit: string;
  status: 'optimal' | 'normal' | 'elevated' | 'high';
  lastUpdated: string;
}

export interface HealthVitals {
  patientId: string;
  bloodPressure?: BloodPressureVital;
  heartRate?: VitalRecord<number>;
  weight?: VitalRecord<number>;
  bmi?: VitalRecord<number>;
  lastCheckup?: string;
  nextFollowUp?: string;
}

export type PrescriptionStatus = 'active' | 'completed' | 'discontinued';

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: PrescriptionStatus;
  instructions?: string;
  refillsRemaining?: number;
}

export type MedicalRecordCategory =
  | 'Lab Reports'
  | 'Prescriptions'
  | 'Imaging'
  | 'Doctor Notes'
  | 'Discharge Summary'
  | 'Other Documents';

export interface MedicalRecord {
  id: string;
  patientId: string;
  name: string;
  category: MedicalRecordCategory;
  date: string;
  uploadedBy: string;
  fileSize?: string;
  fileUrl?: string;
}

export interface DoctorRecommendation {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  avatarUrl?: string;
  availability: string;
  hospitalName: string;
}

export type ActivityType =
  | 'appointment_booked'
  | 'appointment_completed'
  | 'prescription_added'
  | 'medical_report_uploaded'
  | 'profile_updated';

export interface PatientActivity {
  id: string;
  patientId: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

export type NotificationType =
  | 'reminder'
  | 'acceptance'
  | 'prescription'
  | 'report'
  | 'cancellation';

export interface PatientNotification {
  id: string;
  patientId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface PatientDashboardData {
  upcomingAppointment: Appointment | null;
  recentAppointments: Appointment[];
  healthVitals: HealthVitals | null;
  prescriptions: Prescription[];
  medicalRecords: MedicalRecord[];
  recommendedDoctors: DoctorRecommendation[];
  recentActivities: PatientActivity[];
  notifications: PatientNotification[];
  unreadNotificationCount: number;
}
