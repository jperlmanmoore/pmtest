'use client';

import { useState } from 'react';
import { Contact } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';

interface ContactFormProps {
  contact?: Contact;
  caseId: string;
  onSave: (contactData: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CONTACT_TYPES = [
  { value: 'insurance_company', label: 'Insurance Company' },
  { value: 'insurance_adjuster', label: 'Insurance Adjuster' },
  { value: 'medical_provider', label: 'Medical Provider' },
  { value: 'health_insurance', label: 'Health Insurance' },
  { value: 'subrogation_company', label: 'Subrogation Company' },
  { value: 'pre_settlement_loan', label: 'Pre-Settlement Loan Company' }
] as const;

export function ContactForm({ contact, caseId, onSave, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState({
    type: contact?.type || 'insurance_company',
    name: contact?.name || '',
    company: contact?.company || '',
    address: {
      street: contact?.address?.street || '',
      city: contact?.address?.city || '',
      state: contact?.address?.state || '',
      zipCode: contact?.address?.zipCode || ''
    },
    phone: contact?.phone || '',
    fax: contact?.fax || '',
    email: contact?.email || '',
    notes: contact?.notes || '',
    isPrimary: contact?.isPrimary || false,
    isGlobal: contact?.isGlobal ?? true, // Default to global for new contacts
    linkedCases: contact?.linkedCases || [caseId] // Link to current case
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-slate-900">
          {contact ? 'Edit Contact' : 'Add New Contact'}
        </h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Type */}
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Contact Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Contact['type'] }))}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select contact type"
              >
                {CONTACT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contact name"
              />
            </div>

            {/* Company (optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company name (if applicable)"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Fax */}
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Fax
              </label>
              <input
                type="tel"
                value={formData.fax}
                onChange={(e) => setFormData(prev => ({ ...prev, fax: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(555) 123-4568"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@example.com"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-slate-900 mb-4">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Street */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="State"
                  maxLength={2}
                />
              </div>

              {/* ZIP Code */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12345"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about this contact..."
            />
          </div>

          {/* Primary Contact Checkbox */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPrimary}
                onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-slate-800">
                Mark as primary contact for this type
              </span>
            </label>
          </div>

          {/* Global Contact Checkbox */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isGlobal}
                onChange={(e) => setFormData(prev => ({ ...prev, isGlobal: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-slate-800">
                Make this contact available for reuse across multiple cases
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-1 ml-6">
              Global contacts can be imported into other cases, while case-specific contacts are only available in this case.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {contact ? 'Update Contact' : 'Add Contact'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}