import { MedicalProvider } from '../../types';
import { Button } from '../ui/Button';

interface MedicalProviderFormProps {
  providers: MedicalProvider[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof MedicalProvider, value: string) => void;
  onRemove: (index: number) => void;
}

export function MedicalProviderForm({ providers, onAdd, onUpdate, onRemove }: MedicalProviderFormProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Medical Providers</h3>
        <Button
          type="button"
          onClick={onAdd}
          variant="secondary"
          size="sm"
        >
          + Add Medical Provider
        </Button>
      </div>
      <div className="space-y-4">
        {providers?.map((provider, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Provider Name"
                value={provider.name}
                onChange={(e) => onUpdate(index, 'name', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Provider Name"
              />
              <input
                type="text"
                placeholder="Specialty"
                value={provider.specialty || ''}
                onChange={(e) => onUpdate(index, 'specialty', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Specialty"
              />
              <input
                type="text"
                placeholder="Facility"
                value={provider.facility || ''}
                onChange={(e) => onUpdate(index, 'facility', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Facility"
              />
              <input
                type="text"
                placeholder="Contact Info"
                value={provider.contactInfo || ''}
                onChange={(e) => onUpdate(index, 'contactInfo', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Contact Info"
              />
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Notes"
                value={provider.notes || ''}
                onChange={(e) => onUpdate(index, 'notes', e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Notes"
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