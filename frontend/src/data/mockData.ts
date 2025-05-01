import {
  User,
  Patient,
  Doctor,
  Appointment,
  MedicalRecord,
  Prescription,
  Message,
  Conversation
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'p1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'patient',
    profileImage: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'd1',
    name: 'Dr. John Smith',
    email: 'dr.smith@example.com',
    role: 'doctor',
    profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'p2',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    role: 'patient',
    profileImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'd2',
    name: 'Dr. Sarah Williams',
    email: 'dr.williams@example.com',
    role: 'doctor',
    profileImage: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  }
];

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'patient',
    profileImage: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    dateOfBirth: '1990-05-15',
    gender: 'female',
    phoneNumber: '+254712345678',
    address: 'Muranga, Kenya',
    emergencyContact: {
      name: 'John Doe',
      relationship: 'Husband',
      phoneNumber: '+254712345679',
    },
  },
  {
    id: 'p2',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    role: 'patient',
    profileImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    dateOfBirth: '1985-11-23',
    gender: 'male',
    phoneNumber: '+254712345680',
    address: 'Muranga, Kenya',
    emergencyContact: {
      name: 'Mary Johnson',
      relationship: 'Wife',
      phoneNumber: '+254712345681',
    },
  }
];

// Mock Doctors
export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. John Smith',
    email: 'dr.smith@example.com',
    role: 'doctor',
    profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specialization: 'General Practitioner',
    licenseNumber: 'MD12345',
    experience: 8,
    bio: 'Dr. Smith specializes in family medicine with a focus on rural healthcare.',
    availability: [
      { id: 'a1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { id: 'a2', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { id: 'a3', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { id: 'a4', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { id: 'a5', dayOfWeek: 5, startTime: '09:00', endTime: '13:00', isAvailable: true },
    ]
  },
  {
    id: 'd2',
    name: 'Dr. Sarah Williams',
    email: 'dr.williams@example.com',
    role: 'doctor',
    profileImage: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specialization: 'Pediatrician',
    licenseNumber: 'MD54321',
    experience: 12,
    bio: 'Dr. Williams is a pediatrician with a special interest in early childhood development and nutrition.',
    availability: [
      { id: 'a6', dayOfWeek: 1, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { id: 'a7', dayOfWeek: 3, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { id: 'a8', dayOfWeek: 5, startTime: '10:00', endTime: '18:00', isAvailable: true },
    ]
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    patientId: 'p1',
    patient: 'Jane Doe',
    doctorId: 'd1',
    doctor: 'Dr. John Smith',
    scheduled_date: '2025-06-15',
    scheduled_time: '10:00',
    created_at: '10:30',
    status: 'scheduled',
    visit_type: 'video',
    reason: 'Regular checkup',
  },
  {
    id: 'apt2',
    patientId: 'p2',
    patient: 'Robert Johnson',
    doctorId: 'd2',
    doctor: 'Dr. Sarah Williams',
    date: '2025-06-14',
    startTime: '14:00',
    endTime: '14:30',
    status: 'scheduled',
    type: 'video',
    reason: 'Flu symptoms',
  },
  {
    id: 'apt3',
    patientId: 'p1',
    patient: 'Jane Doe',
    doctorId: 'd2',
    doctor: 'Dr. Sarah Williams',
    date: '2025-06-10',
    startTime: '11:00',
    endTime: '11:30',
    status: 'completed',
    type: 'video',
    reason: 'Follow-up on medication',
    notes: 'Patient responding well to treatment. Advised to continue medication for another week.'
  }
];

// Mock Medical Records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 'rec1',
    patientId: 'p1',
    doctorId: 'd2',
    date: '2025-05-10',
    diagnosis: 'Seasonal Allergy',
    symptoms: ['Sneezing', 'Runny nose', 'Itchy eyes'],
    notes: 'Patient presents with seasonal allergies. Prescribed antihistamines.',
    prescriptions: [
      {
        id: 'presc1',
        medicationName: 'Loratadine',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '2 weeks',
        issuedDate: '2025-05-10',
        isActive: true,
      }
    ]
  },
  {
    id: 'rec2',
    patientId: 'p2',
    doctorId: 'd1',
    date: '2025-05-15',
    diagnosis: 'Hypertension',
    symptoms: ['Headache', 'Dizziness', 'High blood pressure'],
    notes: 'Patient diagnosed with stage 1 hypertension. Started on medication and advised lifestyle changes.',
    prescriptions: [
      {
        id: 'presc2',
        medicationName: 'Lisinopril',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '1 month',
        issuedDate: '2025-05-15',
        isActive: true,
      }
    ]
  }
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'p1',
    receiverId: 'd1',
    content: 'Hello Dr. Smith, I\'m experiencing some side effects from the medication.',
    timestamp: '2025-06-12T09:30:00Z',
    read: true,
  },
  {
    id: 'm2',
    senderId: 'd1',
    receiverId: 'p1',
    content: 'Hi Jane, what kind of side effects are you experiencing?',
    timestamp: '2025-06-12T10:15:00Z',
    read: true,
  },
  {
    id: 'm3',
    senderId: 'p1',
    receiverId: 'd1',
    content: 'I\'m feeling dizzy and nauseous after taking the medication.',
    timestamp: '2025-06-12T10:30:00Z',
    read: false,
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: ['p1', 'd1'],
    lastMessage: mockMessages[2],
    unreadCount: 1,
  },
  {
    id: 'conv2',
    participants: ['p2', 'd2'],
    unreadCount: 0,
  }
];

export const getCurrentUser = (): User => {
  // For demo purposes, we'll return a mock patient
  return mockUsers[0];
};