import React, { useState } from 'react';
import { Calendar, List } from 'lucide-react';
import { Appointment } from '../../types';
import AppointmentCard from './AppointmentCard';
import Button from '../ui/Button';

interface AppointmentListProps {
  appointments: Appointment[];
  onJoin?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
}

type ViewMode = 'list' | 'calendar';
type FilterOption = 'all' | 'upcoming' | 'past' | 'today';

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onJoin,
  onReschedule,
  onCancel,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filter, setFilter] = useState<FilterOption>('upcoming');

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.scheduled_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'upcoming':
        return appointmentDate >= today && appointment.status !== 'cancelled';
      case 'past':
        return appointmentDate < today || appointment.status === 'completed';
      case 'today':
        return appointmentDate.toDateString() === today.toDateString();
      default:
        return true;
    }
  });

  // Sort appointments by date (most recent first for upcoming, oldest first for past)
  filteredAppointments.sort((a, b) => {
    const dateA = new Date(`${a.scheduled_date} ${a.scheduled_time}`);
    const dateB = new Date(`${b.scheduled_date} ${b.scheduled_time}`);
    return filter === 'past' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'today' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('today')}
          >
            Today
          </Button>
          <Button
            variant={filter === 'past' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('past')}
          >
            Past
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            leftIcon={<List className="h-4 w-4" />}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            leftIcon={<Calendar className="h-4 w-4" />}
          >
            Calendar
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onJoin={onJoin}
                onReschedule={onReschedule}
                onCancel={onCancel}
              />
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-gray-500">No appointments found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-500 text-center py-12">
            Calendar view will be available in the next version.
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;