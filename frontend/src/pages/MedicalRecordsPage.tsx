import React, { useState } from 'react';
import { Search, Filter, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockMedicalRecords } from '../data/mockData';
import MedicalRecordCard from '../components/medical/MedicalRecordCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const MedicalRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  
  // Filter records relevant to the current user
  const userRecords = mockMedicalRecords.filter(record => 
    user?.role === 'patient' ? record.patientId === user.id : record.doctorId === user.id
  );
  
  // Filter records by search query
  const filteredRecords = userRecords.filter(record => {
    if (!searchQuery) return true;
    
    return (
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.symptoms.some(symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  
  const handleViewRecord = (record: any) => {
    setSelectedRecord(record.id);
  };
  
  const handleCloseRecord = () => {
    setSelectedRecord(null);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const selectedRecordData = selectedRecord 
    ? userRecords.find(record => record.id === selectedRecord) 
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500 mt-1">View and manage your health records</p>
        </div>
        
        {user?.role === 'doctor' && (
          <Button
            leftIcon={<PlusCircle className="h-5 w-5" />}
          >
            Add Record
          </Button>
        )}
      </div>
      
      {selectedRecord && selectedRecordData ? (
        <Card>
          <Card.Header
            title="Medical Record Details"
            action={
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCloseRecord}
              >
                Back to List
              </Button>
            }
          />
          <Card.Content>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedRecordData.diagnosis}</h3>
                  <span className="text-gray-500">{formatDate(selectedRecordData.date)}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecordData.symptoms.map((symptom, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                    <p className="text-gray-600">{selectedRecordData.notes}</p>
                  </div>
                </div>
              </div>
              
              {selectedRecordData.prescriptions && selectedRecordData.prescriptions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Prescriptions</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Medication
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dosage
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Frequency
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedRecordData.prescriptions.map((prescription, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{prescription.medicationName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {prescription.dosage}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {prescription.frequency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {prescription.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                prescription.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {prescription.isActive ? 'Active' : 'Completed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1">
              <Button 
                variant="outline" 
                size="sm"
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filter
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map(record => (
                <MedicalRecordCard
                  key={record.id}
                  record={record}
                  onView={handleViewRecord}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Records Found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? `No medical records matching "${searchQuery}"` 
                    : "You don't have any medical records yet"}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MedicalRecordsPage;