import React from 'react';
import { FileText, Pill } from 'lucide-react';
import { MedicalRecord } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface MedicalRecordCardProps {
  record: MedicalRecord;
  onView?: (record: MedicalRecord) => void;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({
  record,
  onView,
}) => {
  const { date, diagnosis, symptoms, prescriptions, notes } = record;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-teal-500 mr-2" />
          <h3 className="font-medium text-gray-900">{diagnosis}</h3>
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(date)}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-1">Symptoms:</h4>
        <div className="flex flex-wrap gap-1 mb-3">
              {Object.entries(symptoms).map(([value], index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
                {value}
              </span>
            ))}
        </div>
      </div>

      {prescriptions && prescriptions.length > 0 && (
        <div className="mt-3 border-t pt-3 border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Pill className="h-4 w-4 mr-1 text-blue-500" />
            Prescriptions:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {prescriptions.slice(0, 2).map((prescription, index) => (
              <li key={index} className="flex justify-between">
                <span>{prescription.medicationName} - {prescription.dosage}</span>
                <span className={`text-xs ${prescription.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {prescription.isActive ? 'Active' : 'Completed'}
                </span>
              </li>
            ))}
            {prescriptions.length > 2 && (
              <li className="text-sm text-teal-600">+ {prescriptions.length - 2} more</li>
            )}
          </ul>
        </div>
      )}

      {notes && (
        <div className="mt-3 text-sm text-gray-600">
          <p className="line-clamp-2">{notes}</p>
        </div>
      )}

      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView && onView(record)}
          fullWidth
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default MedicalRecordCard;