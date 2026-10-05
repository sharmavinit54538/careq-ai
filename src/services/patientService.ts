import type {
  Appointment,
  HealthVitals,
  Prescription,
  MedicalRecord,
  DoctorRecommendation,
  PatientActivity,
  PatientNotification,
  PatientDashboardData
} from '../types/patient';
import type { User } from '../types/auth';
import { authService } from './authService';

const PATIENT_DATA_STORAGE_KEY = 'careq_patient_data_v1';

interface PatientStore {
  appointments: Record<string, Appointment[]>; // patientId -> appointments
  healthVitals: Record<string, HealthVitals>; // patientId -> vitals
  prescriptions: Record<string, Prescription[]>; // patientId -> prescriptions
  medicalRecords: Record<string, MedicalRecord[]>; // patientId -> records
  activities: Record<string, PatientActivity[]>; // patientId -> activities
  notifications: Record<string, PatientNotification[]>; // patientId -> notifications
}

// Initial clinical data for the primary patient account (Sarah Jenkins - usr_pat_001)
const INITIAL_STORE: PatientStore = {
  appointments: {
    usr_pat_001: [
      {
        id: 'apt_101',
        patientId: 'usr_pat_001',
        doctorId: 'usr_doc_001',
        doctorName: 'Dr. Evelyn Reed',
        doctorSpecialization: 'Cardiology & Internal Medicine',
        doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
        date: new Date(Date.now() + 24 * 3600000).toISOString().split('T')[0],
        time: '10:30 AM',
        type: 'video',
        status: 'confirmed',
        clinicInfo: 'Mount Sinai Telehealth Suite 4A',
        meetingLink: 'https://meet.careq.ai/room/cq-cardio-9128',
        notes: 'Follow-up for cardiovascular assessment and lipid panel review.'
      }
    ]
  },
  healthVitals: {
    usr_pat_001: {
      patientId: 'usr_pat_001',
      bloodPressure: {
        systolic: 118,
        diastolic: 76,
        unit: 'mmHg',
        status: 'optimal',
        lastUpdated: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      heartRate: {
        value: 72,
        unit: 'bpm',
        status: 'normal',
        lastUpdated: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      weight: {
        value: 64.5,
        unit: 'kg',
        status: 'normal',
        lastUpdated: new Date(Date.now() - 7 * 86400000).toISOString()
      },
      bmi: {
        value: 22.4,
        unit: 'kg/m²',
        status: 'normal',
        lastUpdated: new Date(Date.now() - 7 * 86400000).toISOString()
      },
      lastCheckup: '2026-08-14',
      nextFollowUp: '2026-10-15'
    }
  },
  prescriptions: {
    usr_pat_001: [
      {
        id: 'rx_301',
        patientId: 'usr_pat_001',
        doctorId: 'usr_doc_001',
        doctorName: 'Dr. Evelyn Reed',
        date: '2026-08-15',
        medicineName: 'Atorvastatin Calcium',
        dosage: '20mg',
        frequency: '1 tablet once daily',
        duration: '90 days',
        status: 'active',
        instructions: 'Take orally at bedtime. Avoid grapefruit products.',
        refillsRemaining: 2
      },
      {
        id: 'rx_302',
        patientId: 'usr_pat_001',
        doctorId: 'usr_doc_001',
        doctorName: 'Dr. Evelyn Reed',
        date: '2026-06-10',
        medicineName: 'Amoxicillin Trihydrate',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '10 days',
        status: 'completed',
        instructions: 'Finish full 10-day course with meals.',
        refillsRemaining: 0
      }
    ]
  },
  medicalRecords: {
    usr_pat_001: [
      {
        id: 'rec_501',
        patientId: 'usr_pat_001',
        name: 'Comprehensive Metabolic & Lipid Panel',
        category: 'Lab Reports',
        date: '2026-09-18',
        uploadedBy: 'Quest Diagnostics Central Lab',
        fileSize: '1.4 MB',
        fileUrl: '#'
      },
      {
        id: 'rec_502',
        patientId: 'usr_pat_001',
        name: '12-Lead Resting Electrocardiogram (ECG)',
        category: 'Imaging',
        date: '2026-08-14',
        uploadedBy: 'Dr. Evelyn Reed',
        fileSize: '3.2 MB',
        fileUrl: '#'
      },
      {
        id: 'rec_503',
        patientId: 'usr_pat_001',
        name: 'Cardiology Annual Wellness Consultation Summary',
        category: 'Doctor Notes',
        date: '2026-08-14',
        uploadedBy: 'Dr. Evelyn Reed',
        fileSize: '840 KB',
        fileUrl: '#'
      }
    ]
  },
  activities: {
    usr_pat_001: [
      {
        id: 'act_701',
        patientId: 'usr_pat_001',
        type: 'appointment_booked',
        title: 'Video Consultation Scheduled',
        description: 'Confirmed appointment with Dr. Evelyn Reed for tomorrow at 10:30 AM.',
        timestamp: new Date(Date.now() - 4 * 3600000).toISOString()
      },
      {
        id: 'act_702',
        patientId: 'usr_pat_001',
        type: 'medical_report_uploaded',
        title: 'Lab Report Added',
        description: 'Quest Diagnostics uploaded Comprehensive Metabolic & Lipid Panel.',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'act_703',
        patientId: 'usr_pat_001',
        type: 'prescription_added',
        title: 'Prescription Refilled',
        description: 'Dr. Evelyn Reed authorized refill for Atorvastatin Calcium 20mg.',
        timestamp: new Date(Date.now() - 14 * 86400000).toISOString()
      }
    ]
  },
  notifications: {
    usr_pat_001: [
      {
        id: 'notif_901',
        patientId: 'usr_pat_001',
        type: 'reminder',
        title: 'Upcoming Video Consultation',
        message: 'Your teleconsultation with Dr. Evelyn Reed starts tomorrow at 10:30 AM.',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        isRead: false,
        actionUrl: '/patient/appointments'
      },
      {
        id: 'notif_902',
        patientId: 'usr_pat_001',
        type: 'report',
        title: 'New Diagnostic Result Available',
        message: 'Your Comprehensive Metabolic & Lipid Panel report is ready for viewing.',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        isRead: false,
        actionUrl: '/patient/medical-records'
      },
      {
        id: 'notif_903',
        patientId: 'usr_pat_001',
        type: 'prescription',
        title: 'Prescription Status Active',
        message: 'Atorvastatin Calcium 20mg is active with 2 refills remaining.',
        timestamp: new Date(Date.now() - 12 * 86400000).toISOString(),
        isRead: true,
        actionUrl: '/patient/prescriptions'
      }
    ]
  }
};

class PatientService {
  private store: PatientStore;

  constructor() {
    this.store = this.loadStore();
  }

  private loadStore(): PatientStore {
    try {
      const raw = localStorage.getItem(PATIENT_DATA_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Fallback
    }
    const fresh = JSON.parse(JSON.stringify(INITIAL_STORE));
    this.persistStore(fresh);
    return fresh;
  }

  private persistStore(data: PatientStore): void {
    try {
      localStorage.setItem(PATIENT_DATA_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  private delay(ms = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private ensurePatientInitialized(patientId: string): void {
    let modified = false;

    if (!this.store.appointments[patientId] || this.store.appointments[patientId].length === 0) {
      const templateApts = INITIAL_STORE.appointments['usr_pat_001'] || [];
      this.store.appointments[patientId] = templateApts.map((a, i) => ({
        ...a,
        id: `apt_${patientId}_${i}`,
        patientId
      }));
      modified = true;
    }

    if (!this.store.healthVitals[patientId]) {
      const templateVitals = INITIAL_STORE.healthVitals['usr_pat_001'];
      if (templateVitals) {
        this.store.healthVitals[patientId] = {
          ...templateVitals,
          patientId
        };
        modified = true;
      }
    }

    if (!this.store.prescriptions[patientId] || this.store.prescriptions[patientId].length === 0) {
      const templateRx = INITIAL_STORE.prescriptions['usr_pat_001'] || [];
      this.store.prescriptions[patientId] = templateRx.map((rx, i) => ({
        ...rx,
        id: `rx_${patientId}_${i}`,
        patientId
      }));
      modified = true;
    }

    if (!this.store.medicalRecords[patientId] || this.store.medicalRecords[patientId].length === 0) {
      const templateRecs = INITIAL_STORE.medicalRecords['usr_pat_001'] || [];
      this.store.medicalRecords[patientId] = templateRecs.map((rec, i) => ({
        ...rec,
        id: `rec_${patientId}_${i}`,
        patientId
      }));
      modified = true;
    }

    if (!this.store.activities[patientId] || this.store.activities[patientId].length === 0) {
      const templateActs = INITIAL_STORE.activities['usr_pat_001'] || [];
      this.store.activities[patientId] = templateActs.map((act, i) => ({
        ...act,
        id: `act_${patientId}_${i}`,
        patientId
      }));
      modified = true;
    }

    if (!this.store.notifications[patientId] || this.store.notifications[patientId].length === 0) {
      const templateNotifs = INITIAL_STORE.notifications['usr_pat_001'] || [];
      this.store.notifications[patientId] = templateNotifs.map((notif, i) => ({
        ...notif,
        id: `notif_${patientId}_${i}`,
        patientId
      }));
      modified = true;
    }

    if (modified) {
      this.persistStore(this.store);
    }
  }

  // --- Aggregate Dashboard Loader ---
  async getDashboardData(patientId: string): Promise<PatientDashboardData> {
    await this.delay(350);
    this.ensurePatientInitialized(patientId);

    const appointments = this.store.appointments[patientId] || [];
    const now = new Date();

    // Find first upcoming or confirmed appointment
    const upcoming = appointments.find((a) => {
      const appointmentDate = new Date(`${a.date} ${a.time}`);
      return (
        (a.status === 'upcoming' || a.status === 'confirmed' || a.status === 'scheduled') &&
        (isNaN(appointmentDate.getTime()) || appointmentDate >= now || a.date >= now.toISOString().split('T')[0])
      );
    }) || appointments[0] || null;

    const vitals = this.store.healthVitals[patientId] || null;
    const prescriptions = this.store.prescriptions[patientId] || [];
    const medicalRecords = this.store.medicalRecords[patientId] || [];
    const activities = this.store.activities[patientId] || [];
    const notifications = this.store.notifications[patientId] || [];
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const recommendedDoctors = await this.getRecommendedDoctors();

    return {
      upcomingAppointment: upcoming,
      recentAppointments: appointments,
      healthVitals: vitals,
      prescriptions,
      medicalRecords,
      recommendedDoctors,
      recentActivities: activities,
      notifications,
      unreadNotificationCount: unreadCount
    };
  }

  // --- Appointments ---
  async getAppointments(patientId: string): Promise<Appointment[]> {
    await this.delay(250);
    return this.store.appointments[patientId] || [];
  }

  async bookAppointment(
    patientId: string,
    appointmentData: Omit<Appointment, 'id' | 'patientId' | 'status'>
  ): Promise<Appointment> {
    await this.delay(400);

    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt_${Date.now()}`,
      patientId,
      status: 'confirmed',
      meetingLink: appointmentData.type === 'video' ? `https://meet.careq.ai/room/cq-${Date.now().toString(36)}` : undefined
    };

    if (!this.store.appointments[patientId]) {
      this.store.appointments[patientId] = [];
    }
    this.store.appointments[patientId].unshift(newAppointment);

    // Also record an activity entry
    this.addActivity(patientId, {
      type: 'appointment_booked',
      title: 'Appointment Scheduled',
      description: `Booked ${newAppointment.type === 'video' ? 'Video Consultation' : 'In-Person Visit'} with ${newAppointment.doctorName}.`
    });

    // Also add notification
    this.addNotification(patientId, {
      type: 'acceptance',
      title: 'Appointment Confirmed',
      message: `Your appointment with ${newAppointment.doctorName} for ${newAppointment.date} at ${newAppointment.time} has been scheduled.`,
      actionUrl: '/patient/appointments'
    });

    this.persistStore(this.store);
    return newAppointment;
  }

  async cancelAppointment(patientId: string, appointmentId: string): Promise<void> {
    await this.delay(300);
    const list = this.store.appointments[patientId] || [];
    const target = list.find((a) => a.id === appointmentId);
    if (target) {
      target.status = 'cancelled';
      this.addActivity(patientId, {
        type: 'appointment_completed',
        title: 'Appointment Cancelled',
        description: `Cancelled appointment with ${target.doctorName}.`
      });
      this.persistStore(this.store);
    }
  }

  // --- Health Vitals ---
  async getHealthVitals(patientId: string): Promise<HealthVitals | null> {
    await this.delay(200);
    return this.store.healthVitals[patientId] || null;
  }

  async updateHealthVitals(patientId: string, vitals: Partial<HealthVitals>): Promise<HealthVitals> {
    await this.delay(350);

    const existing = this.store.healthVitals[patientId] || {
      patientId
    };

    const updated: HealthVitals = {
      ...existing,
      ...vitals,
      patientId
    };

    this.store.healthVitals[patientId] = updated;

    this.addActivity(patientId, {
      type: 'profile_updated',
      title: 'Health Vitals Logged',
      description: 'Recorded updated vital telemetry signs in clinical log.'
    });

    this.persistStore(this.store);
    return updated;
  }

  // --- Prescriptions ---
  async getPrescriptions(patientId: string): Promise<Prescription[]> {
    await this.delay(250);
    return this.store.prescriptions[patientId] || [];
  }

  // --- Medical Records ---
  async getMedicalRecords(patientId: string, category?: string): Promise<MedicalRecord[]> {
    await this.delay(250);
    const records = this.store.medicalRecords[patientId] || [];
    if (!category || category === 'All') return records;
    return records.filter((r) => r.category === category);
  }

  async uploadMedicalRecord(
    patientId: string,
    recordData: Omit<MedicalRecord, 'id' | 'patientId' | 'date'>
  ): Promise<MedicalRecord> {
    await this.delay(400);

    const newRecord: MedicalRecord = {
      ...recordData,
      id: `rec_${Date.now()}`,
      patientId,
      date: new Date().toISOString().split('T')[0]
    };

    if (!this.store.medicalRecords[patientId]) {
      this.store.medicalRecords[patientId] = [];
    }
    this.store.medicalRecords[patientId].unshift(newRecord);

    this.addActivity(patientId, {
      type: 'medical_report_uploaded',
      title: 'Medical Record Uploaded',
      description: `Added "${newRecord.name}" under ${newRecord.category}.`
    });

    this.persistStore(this.store);
    return newRecord;
  }

  // --- Recommended Doctors ---
  async getRecommendedDoctors(): Promise<DoctorRecommendation[]> {
    // Pull actual verified doctors from backend/authService
    try {
      const allDoctors: User[] = await authService.adminGetDoctorsList();
      const approvedDoctors = allDoctors.filter(
        (d) => d.doctorProfile?.verificationStatus === 'approved'
      );

      if (approvedDoctors.length > 0) {
        return approvedDoctors.map((doc) => ({
          id: doc.id,
          name: doc.name,
          specialization: doc.doctorProfile?.specialization || 'General Healthcare',
          experienceYears: doc.doctorProfile?.experienceYears || 5,
          rating: 4.9,
          reviewCount: 142,
          avatarUrl:
            doc.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0d9488&color=fff`,
          availability: 'Available Today',
          hospitalName: doc.doctorProfile?.hospitalName || 'CareQ Medical Pavilion'
        }));
      }
    } catch {
      // Fallback to empty list or fallback doctor
    }

    return [
      {
        id: 'usr_doc_001',
        name: 'Dr. Evelyn Reed',
        specialization: 'Cardiology & Internal Medicine',
        experienceYears: 14,
        rating: 4.95,
        reviewCount: 218,
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
        availability: 'Available Today',
        hospitalName: 'Mount Sinai Cardiovascular Institute'
      }
    ];
  }

  // --- Activity Timeline ---
  async getRecentActivities(patientId: string): Promise<PatientActivity[]> {
    await this.delay(200);
    return this.store.activities[patientId] || [];
  }

  private addActivity(
    patientId: string,
    activity: Omit<PatientActivity, 'id' | 'patientId' | 'timestamp'>
  ): void {
    if (!this.store.activities[patientId]) {
      this.store.activities[patientId] = [];
    }
    this.store.activities[patientId].unshift({
      ...activity,
      id: `act_${Date.now()}`,
      patientId,
      timestamp: new Date().toISOString()
    });
  }

  // --- Notifications ---
  async getNotifications(patientId: string): Promise<PatientNotification[]> {
    await this.delay(200);
    return this.store.notifications[patientId] || [];
  }

  async markNotificationAsRead(patientId: string, notificationId: string): Promise<void> {
    const list = this.store.notifications[patientId] || [];
    const item = list.find((n) => n.id === notificationId);
    if (item) {
      item.isRead = true;
      this.persistStore(this.store);
    }
  }

  async markAllNotificationsAsRead(patientId: string): Promise<void> {
    const list = this.store.notifications[patientId] || [];
    list.forEach((n) => {
      n.isRead = true;
    });
    this.persistStore(this.store);
  }

  private addNotification(
    patientId: string,
    notif: Omit<PatientNotification, 'id' | 'patientId' | 'timestamp' | 'isRead'>
  ): void {
    if (!this.store.notifications[patientId]) {
      this.store.notifications[patientId] = [];
    }
    this.store.notifications[patientId].unshift({
      ...notif,
      id: `notif_${Date.now()}`,
      patientId,
      timestamp: new Date().toISOString(),
      isRead: false
    });
  }

  // --- Update Patient Profile ---
  async updateProfile(
    patientId: string,
    updates: {
      name?: string;
      phone?: string;
      dateOfBirth?: string;
      bloodGroup?: string;
      emergencyContact?: string;
      allergies?: string[];
      avatarUrl?: string;
    }
  ): Promise<void> {
    await this.delay(400);

    // Update in authService users database directly
    const storedUsersRaw = localStorage.getItem('careq_users_db_v1');
    if (storedUsersRaw) {
      try {
        const users: User[] = JSON.parse(storedUsersRaw);
        const user = users.find((u) => u.id === patientId);
        if (user) {
          if (updates.name) user.name = updates.name.trim();
          if (updates.phone) user.phone = updates.phone.trim();
          if (updates.avatarUrl) user.avatarUrl = updates.avatarUrl;
          if (!user.patientProfile) user.patientProfile = {};
          if (updates.dateOfBirth) user.patientProfile.dateOfBirth = updates.dateOfBirth;
          if (updates.bloodGroup) user.patientProfile.bloodGroup = updates.bloodGroup;
          if (updates.emergencyContact) user.patientProfile.emergencyContact = updates.emergencyContact;
          if (updates.allergies) user.patientProfile.allergies = updates.allergies;

          localStorage.setItem('careq_users_db_v1', JSON.stringify(users));

          // Also update session
          const sessionRaw =
            localStorage.getItem('careq_session_token_v1') || sessionStorage.getItem('careq_session_token_v1');
          if (sessionRaw) {
            const session = JSON.parse(sessionRaw);
            if (session.user?.id === patientId) {
              session.user = { ...session.user, ...user };
              if (session.rememberMe) {
                localStorage.setItem('careq_session_token_v1', JSON.stringify(session));
              } else {
                sessionStorage.setItem('careq_session_token_v1', JSON.stringify(session));
              }
            }
          }
        }
      } catch {
        // ignore
      }
    }

    this.addActivity(patientId, {
      type: 'profile_updated',
      title: 'Profile Updated',
      description: 'Patient medical profile information was saved.'
    });
  }
}

export const patientService = new PatientService();
