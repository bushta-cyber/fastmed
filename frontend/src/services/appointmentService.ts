import axios from 'axios';
// Base URL for the API
const API_URL = 'http://127.0.0.1:8000/api/appointments/';
const token = localStorage.getItem('access');
if (!token) throw new Error('No user authenticated');

class AppointmentService {
    // Fetch all appointments for the logged-in user
    static async getAppointments() {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(response)
        return response.data;
      } catch (error) {
        throw new Error('Error fetching appointments');
      }
    }


    // Get appointments, with the option to filter by status or date
    static async getFilterAppointments(userId: number, status?: string, filter?: string) {
        let url = `${API_URL}?user=${userId}`;
        if (status) url += `&status=${status}`;
        if (filter) url += `&filter=${filter}`;

        try {
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          throw new Error("Failed to fetch appointments");
        }
      }

  // Book a new appointment
  static async bookAppointment(doctorId: number, date: string, time: string, visitType: string) {
    try {
      const response = await axios.post(API_URL, {
        doctor: doctorId,
        date: date,
        scheduled_time: time,
        visit_type: visitType,
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to book appointment');
    }
  }

   // Reschedule an appointment
   static async rescheduleAppointment(
    appointmentId: number,
    newDate: string,
    newTime: string,
    visitType: string
  ) {
    try {
      const response = await axios.patch(`${API_URL}${appointmentId}/`, {
        date: newDate,
        time: newTime,
        visit_type: visitType,
       headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to reschedule appointment");
    }
  }

  // Cancel an appointment
  static async cancelAppointment(appointmentId: number) {
    try {
      const response = await axios.delete(`${API_URL}${appointmentId}/`, {
      headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to cancel appointment');
    }
  }

  // Update the status of an appointment (for doctors or admins)
  static async updateAppointmentStatus(appointmentId: number, status: string) {
    try {
      const response = await axios.patch(`${API_URL}${appointmentId}/`, {
        status: status,
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update appointment status');
    }
  }

  // Fetch all available doctors
  static async getDoctors() {
    try {
      const response = await axios.get('/api/availability/', {
      headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error fetching doctors');
    }
  }
}

export default AppointmentService;
