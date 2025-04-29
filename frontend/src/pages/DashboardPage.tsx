import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, Clock, BarChart2, Users, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAppointments, mockDoctors, mockMedicalRecords } from '../data/mockData';
import Card from '../components/ui/Card';
import AppointmentCard from '../components/appointments/AppointmentCard';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filter appointments relevant to the current user
  const userAppointments = mockAppointments.filter(apt => 
    user?.role === 'patient' ? apt.patientId === user.id : apt.doctorId === user.id
  );
  
  // Get upcoming appointments
  const upcomingAppointments = userAppointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Get recent medical records if user is a patient
  const recentMedicalRecords = user?.role === 'patient' 
    ? mockMedicalRecords
        .filter(record => record.patientId === user.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2)
    : [];
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleJoinCall = (appointmentId: string) => {
    navigate(`/video-call/${appointmentId}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your health today
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: <Calendar className="h-6 w-6 text-blue-500" />,
            label: "Schedule Appointment",
            path: "/appointments/new"
          },
          {
            icon: <MessageSquare className="h-6 w-6 text-green-500" />,
            label: "Message Doctor",
            path: "/messages"
          },
          {
            icon: <PlusCircle className="h-6 w-6 text-purple-500" />,
            label: user?.role === 'patient' ? "View Medical Records" : "Add Patient",
            path: user?.role === 'patient' ? "/medical-records" : "/patients/new"
          },
          {
            icon: <Users className="h-6 w-6 text-orange-500" />,
            label: user?.role === 'patient' ? "Browse Doctors" : "My Patients",
            path: user?.role === 'patient' ? "/doctors" : "/patients"
          }
        ].map((action, index) => (
          <Card 
            key={index} 
            className="flex items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate(action.path)}
          >
            <div className="mr-4 p-2 rounded-full bg-gray-100">
              {action.icon}
            </div>
            <span className="font-medium text-gray-700">{action.label}</span>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header
              title="Upcoming Appointments"
              action={
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/appointments')}
                >
                  View All
                </Button>
              }
            />
            <Card.Content>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{appointment.reason}</h4>
                          <p className="text-sm text-gray-500">
                            with {user?.role === 'patient' ? appointment.doctorName : appointment.patientName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatDate(appointment.date)}</p>
                          <p className="text-sm text-gray-500">{appointment.startTime} - {appointment.endTime}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        {new Date(appointment.date).toDateString() === new Date().toDateString() && (
                          <Button
                            size="sm"
                            onClick={() => handleJoinCall(appointment.id)}
                          >
                            Join Video Call
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No upcoming appointments</p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate('/appointments/new')}
                  >
                    Schedule Appointment
                  </Button>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
        
        {/* Health Summary / Doctor Schedule */}
        <div>
          {user?.role === 'patient' ? (
            <Card>
              <Card.Header
                title="Health Summary"
              />
              <Card.Content className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Next Appointment</span>
                  </div>
                  <span>
                    {upcomingAppointments.length > 0 
                      ? formatDate(upcomingAppointments[0].date) 
                      : 'None scheduled'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-full mr-3">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium">Unread Messages</span>
                  </div>
                  <span className="bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    3
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-full mr-3">
                      <BarChart2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-medium">Health Records</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/medical-records')}
                  >
                    View
                  </Button>
                </div>
                
                {recentMedicalRecords.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Recent Medical Records</h4>
                    {recentMedicalRecords.map(record => (
                      <div key={record.id} className="border p-3 rounded-lg mb-2">
                        <div className="flex justify-between">
                          <div>
                            <h5 className="font-medium text-sm">{record.diagnosis}</h5>
                            <p className="text-xs text-gray-500">Dr. {mockDoctors.find(d => d.id === record.doctorId)?.name.split(' ')[1]}</p>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>
          ) : (
            <Card>
              <Card.Header
                title="Today's Schedule"
              />
              <Card.Content>
                {upcomingAppointments.filter(apt => 
                  new Date(apt.date).toDateString() === new Date().toDateString()
                ).length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments
                      .filter(apt => new Date(apt.date).toDateString() === new Date().toDateString())
                      .map(apt => (
                        <div key={apt.id} className="flex items-center p-3 border rounded-lg">
                          <div className="w-14 text-center">
                            <div className="text-lg font-bold">{apt.startTime}</div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="font-medium">{apt.patientName}</div>
                            <div className="text-sm text-gray-500">{apt.reason}</div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => handleJoinCall(apt.id)}
                          >
                            Join
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;