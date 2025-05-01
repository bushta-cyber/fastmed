import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAppointments } from '../data/mockData';
import AppointmentList from '../components/appointments/AppointmentList';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Appointment } from '../types';
import AppointmentService from '../services/appointmentService';

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter appointments relevant to the current user
  const userAppointments = mockAppointments.filter(apt =>
    user?.role === 'patient' ? Number(apt.patientId) === user.id : Number(apt.doctorId) === user?.id
  );

  const [appointmentss, setAppointments] = useState<Appointment[]>([])
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await AppointmentService.getAppointments();
        setAppointments(data);
      } catch (err) {
        setError('Failed to load appointments');
      }
    };

    fetchAppointments();
  }, []);


  const handleJoinCall = (appointment: any) => {
    navigate(`/video-call/${appointment.id}`);
  };

  const handleReschedule = (appointment: any) => {
    // In a real app, this would open a reschedule modal or navigate to a reschedule page
    alert(`Reschedule appointment: ${appointment.id}`);
  };

  const handleCancel = (appointment: any) => {
    // In a real app, this would open a confirmation modal and then cancel the appointment
    alert(`Cancel appointment: ${appointment.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 mt-1">Manage your upcoming and past appointments</p>
        </div>
        <Button
          onClick={() => navigate('/appointments/new')}
          leftIcon={<Plus className="h-5 w-5" />}
        >
          New Appointment
        </Button>
      </div>

      <Card>
        <Card.Content>
          <AppointmentList
            appointments={appointmentss}
            onJoin={handleJoinCall}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
        </Card.Content>
      </Card>
    </div>
  );
};

export default AppointmentsPage;