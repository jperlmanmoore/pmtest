import { Insurance } from '../../types';
import { Button } from '../ui/Button';

interface InsuranceFormProps {
  insurance: Insurance[];
  type: 'liability' | 'personal' | 'other';
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Insurance, value: string) => void;
  onRemove: (index: number) => void;
}

export function InsuranceForm({ insurance, type, onAdd, onUpdate, onRemove }: InsuranceFormProps) {
  const getTitle = () => {
    switch (type) {
      case 'liability': return 'Liability Insurance';
      case 'personal': return 'Personal Insurance';
      case 'other': return 'Other Insurance';
      default: return 'Insurance';
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'liability': return '+ Add Liability Insurance';
      case 'personal': return '+ Add Personal Insurance';
      case 'other': return '+ Add Other Insurance';
      default: return '+ Add Insurance';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{getTitle()}</h3>
        <Button
          type="button"
          onClick={onAdd}
          variant="secondary"
          size="sm"
        >
          {getButtonText()}
        </Button>
      </div>
      <div className="space-y-4">
        {insurance?.map((ins, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Insurance Company"
                value={ins.company}
                onChange={(e) => onUpdate(index, 'company', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Insurance Company"
              />
              <input
                type="text"
                placeholder="Policy Number"
                value={ins.policyNumber}
                onChange={(e) => onUpdate(index, 'policyNumber', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Policy Number"
              />
              <input
                type="text"
                placeholder="Coverage"
                value={ins.coverage}
                onChange={(e) => onUpdate(index, 'coverage', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Coverage"
              />
              <input
                type="text"
                placeholder="Contact Info"
                value={ins.contactInfo}
                onChange={(e) => onUpdate(index, 'contactInfo', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Contact Info"
              />
            </div>
            <Button
              type="button"
              onClick={() => onRemove(index)}
              variant="danger"
              size="sm"
              className="mt-4"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}