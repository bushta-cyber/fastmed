import React from 'react';
import { Calendar, Clock, Video, MapPin } from 'lucide-react';
import { Appointment } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AppointmentCardProps {
  appointment: Appointment;
  onJoin?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onJoin,
  onReschedule,
  onCancel,
}) => {
  const { date, startTime, endTime, doctorName, patientName, status, type, reason } = appointment;
  
  const isUpcoming = status === 'scheduled';
  const isToday = new Date(date).toDateString() === new Date().toDateString();
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          {isToday && status === 'scheduled' && (
            <span className="ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-teal-100 text-teal-800">
              Today
            </span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          {type === 'video' ? (
            <Video className="h-4 w-4 mr-1 text-teal-500" />
          ) : (
            <MapPin className="h-4 w-4 mr-1 text-teal-500" />
          )}
          <span>{type === 'video' ? 'Video Consultation' : 'In-person'}</span>
        </div>
      </div>
      
      <h3 className="font-medium text-lg text-gray-900 mb-2">
        {reason}
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2 text-gray-400" />
          <span>{formatDate(date)}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-2 text-gray-400" />
          <span>{startTime} - {endTime}</span>
        </div>
        
        <div className="py-3 border-t border-b border-gray-100">
          <p className="text-sm text-gray-500 mb-1">
            {appointment.doctorId.startsWith('d') ? 'Doctor' : 'Patient'}
          </p>
          <p className="font-medium">
            {appointment.doctorId.startsWith('d') ? doctorName : patientName}
          </p>
        </div>
      </div>
      
      {isUpcoming && (
        <div className="mt-4 flex flex-wrap gap-2">
          {onJoin && (
            <Button 
              variant={isToday ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => onJoin(appointment)}
              leftIcon={<Video className="h-4 w-4" />}
            >
              Join Call
            </Button>
          )}
          
          {onReschedule && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReschedule(appointment)}
            >
              Reschedule
            </Button>
          )}
          
          {onCancel && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onCancel(appointment)}
              className="text-red-600 hover:bg-red-50"
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default AppointmentCard;