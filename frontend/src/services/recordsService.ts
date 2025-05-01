import axios from 'axios';
// Base URL for the API
const API_URL = 'http://127.0.0.1:8000/api/medical-records/';

const token = localStorage.getItem('access');
if (!token) throw new Error('No user authenticated');

class RecordService {
    // Fetch all Records for the logged-in user
    static async getRecords() {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(response)
        return response.data;
      } catch (error) {
        // throw new Error('Error fetching Records');
        console.log(token)
      }
    }

    // Get Records, with the option to filter by status or date
    static async getFilterRecords(userId: number, status?: string, filter?: string) {
        let url = `${API_URL}?user=${userId}`;
        if (status) url += `&status=${status}`;
        if (filter) url += `&filter=${filter}`;

        try {
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          throw new Error("Failed to fetch Records");
        }
      }

  // Book a new Record
  static async bookRecord(doctor: number, date: string, symptoms: string, notes: string, diagnosis:string, patient:number) {
    try {
      const response = await axios.post(API_URL, {
        doctor: doctor,
        patient: patient,
        date: date,
        diagnosis: diagnosis,
        symptoms: symptoms,
        notes: notes,
        // prescriptions: prescriptions,
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to book Record');
    }
  }


  // Update the status of an Record (for doctors or admins)
  static async updateRecordStatus(RecordId: number, diagnosis: string, symptoms:string, notes:string) {
    try {
      const response = await axios.patch(`${API_URL}${RecordId}/`, {
        diagnosis: diagnosis,
        symptoms: symptoms,
        notes: notes,
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update Record status');
    }
  }
}

export default RecordService;
