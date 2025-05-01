// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  profileImage?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  address: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medicalHistory?: MedicalRecord[];
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  experience: number; // in years
  availability?: Availability[];
  bio?: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  patient: string;
  doctorId: string;
  doctor: string;
  scheduled_date: string;
  scheduled_time: string;
  created_at: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  visit_type: 'video' | 'in-person';
  reason: string;
  notes?: string;
}

// Medical Record Types
export interface MedicalRecord {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  diagnosis: string;
  symptoms:  { [key: string]: string };
  notes: string;
  prescriptions?: Prescription[];
  attachments?: Attachment[];
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  issuedDate: string;
  isActive: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

// Schedule Types
export interface Availability {
  id: string;
  dayOfWeek: number; // 0-6, where 0 is Sunday
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Authentication Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}