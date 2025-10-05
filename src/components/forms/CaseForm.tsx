'use client';

import { useState } from 'react';
import { Case, Client, CaseFormData, Insurance, StatuteOfLimitations } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';

interface CaseFormProps {
  clients: Client[];
  cases: Case[]; // For parent case selection
  editingCase: Case | null;
  onSubmit: (formData: CaseFormData) => void;
  onCancel: () => void;
}

export function CaseForm({ clients, cases, editingCase, onSubmit, onCancel }: CaseFormProps) {
  const [form, setForm] = useState<CaseFormData>({
    clientId: editingCase?.clientId._id || '',
    caseNumber: editingCase?.caseNumber || '',
    title: editingCase?.title || '',
    description: editingCase?.description || '',
    stage: editingCase?.stage || 'intake',
    dateOfLoss: editingCase?.dateOfLoss || '',
    anteLitemRequired: editingCase?.anteLitemRequired || false,
    anteLitemAgency: editingCase?.anteLitemAgency || '',
    anteLitemDeadline: editingCase?.anteLitemDeadline || '',
    parentCaseId: editingCase?.parentCaseId || '',
    liabilityInsurance: editingCase?.liabilityInsurance || [],
    personalInsurance: editingCase?.personalInsurance || [],
    otherInsurance: editingCase?.otherInsurance || [],
    healthInsurance: editingCase?.healthInsurance,
    statuteOfLimitations: editingCase?.statuteOfLimitations,
  });

  const [showInsuranceSection, setShowInsuranceSection] = useState(false);
  const [showSOLSection, setShowSOLSection] = useState(false);

  // Insurance management functions
  const addInsurance = (type: 'liability' | 'personal' | 'other') => {
    const newInsurance: Insurance = {
      company: '',
      policyHolder: '',
      policyNumber: '',
      claimNumber: '',
      adjuster: '',
      coverage: '',
      contactInfo: '',
      notes: '',
    };

    const key = `${type}Insurance` as keyof CaseFormData;
    const currentInsurance = (form[key] as Insurance[]) || [];
    setForm({
      ...form,
      [key]: [...currentInsurance, newInsurance],
    });
  };

  const updateInsurance = (type: 'liability' | 'personal' | 'other', index: number, field: keyof Insurance, value: string) => {
    const key = `${type}Insurance` as keyof CaseFormData;
    const currentInsurance = (form[key] as Insurance[]) || [];
    const updatedInsurance = [...currentInsurance];
    updatedInsurance[index] = { ...updatedInsurance[index], [field]: value };

    setForm({
      ...form,
      [key]: updatedInsurance,
    });
  };

  const removeInsurance = (type: 'liability' | 'personal' | 'other', index: number) => {
    const key = `${type}Insurance` as keyof CaseFormData;
    const currentInsurance = (form[key] as Insurance[]) || [];
    const updatedInsurance = currentInsurance.filter((_, i) => i !== index);

    setForm({
      ...form,
      [key]: updatedInsurance,
    });
  };

  const updateHealthInsurance = (field: keyof Insurance, value: string) => {
    setForm({
      ...form,
      healthInsurance: {
        ...form.healthInsurance,
        [field]: value,
      } as Insurance,
    });
  };

  const updateStatuteOfLimitations = (field: keyof StatuteOfLimitations, value: string | number | string[]) => {
    setForm({
      ...form,
      statuteOfLimitations: {
        ...form.statuteOfLimitations,
        [field]: value,
      } as StatuteOfLimitations,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-xl font-bold text-slate-900">
          {editingCase ? 'Edit Case' : 'Add New Case'}
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Client
              </label>
              <select
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select a client"
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Link to Parent Case (Optional)
              </label>
              <select
                value={form.parentCaseId}
                onChange={(e) => setForm({ ...form, parentCaseId: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Link to parent case from same incident"
              >
                <option value="">No parent case (this will be a parent case)</option>
                {cases
                  .filter(caseItem => !caseItem.parentCaseId) // Only show cases that are not already child cases
                  .map(caseItem => (
                    <option key={caseItem._id} value={caseItem._id}>
                      {caseItem.title} - {caseItem.clientId.name}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Select a parent case if this is part of the same incident
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Case Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter case title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter case description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stage
              </label>
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select case stage"
              >
                <option value="intake">Intake</option>
                <option value="opening">Opening</option>
                <option value="treating">Treating</option>
                <option value="demandPrep">Demand Prep</option>
                <option value="negotiation">Negotiation</option>
                <option value="settlement">Settlement</option>
                <option value="resolution">Resolution</option>
                <option value="probate">Probate</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date of Loss
              </label>
              <input
                type="date"
                value={form.dateOfLoss}
                onChange={(e) => setForm({ ...form, dateOfLoss: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select date of loss"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.anteLitemRequired}
                  onChange={(e) => setForm({ ...form, anteLitemRequired: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-slate-700">
                  Ante Litem Required
                </span>
              </label>
            </div>

            {form.anteLitemRequired && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ante Litem Agency
                  </label>
                  <input
                    type="text"
                    value={form.anteLitemAgency}
                    onChange={(e) => setForm({ ...form, anteLitemAgency: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter agency"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ante Litem Deadline
                  </label>
                  <input
                    type="date"
                    value={form.anteLitemDeadline}
                    onChange={(e) => setForm({ ...form, anteLitemDeadline: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Select ante litem deadline"
                  />
                </div>
              </>
            )}
          </div>

          {/* Insurance Information Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-900">Insurance Information</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowInsuranceSection(!showInsuranceSection)}
              >
                {showInsuranceSection ? 'Hide Insurance' : 'Show Insurance'}
              </Button>
            </div>

            {showInsuranceSection && (
              <div className="space-y-6">
                {/* Liability Insurance */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-slate-900">Liability Insurance</h4>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => addInsurance('liability')}
                    >
                      Add Liability Insurance
                    </Button>
                  </div>
                  {form.liabilityInsurance && form.liabilityInsurance.length > 0 && (
                    <div className="space-y-4">
                      {form.liabilityInsurance.map((insurance, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="text-sm font-medium text-slate-900">Insurance #{index + 1}</h5>
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              onClick={() => removeInsurance('liability', index)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Insurance Company
                              </label>
                              <input
                                type="text"
                                value={insurance.company}
                                onChange={(e) => updateInsurance('liability', index, 'company', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter insurance company"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Policy Holder
                              </label>
                              <input
                                type="text"
                                value={insurance.policyHolder}
                                onChange={(e) => updateInsurance('liability', index, 'policyHolder', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter policy holder"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Policy Number
                              </label>
                              <input
                                type="text"
                                value={insurance.policyNumber}
                                onChange={(e) => updateInsurance('liability', index, 'policyNumber', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter policy number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Claim Number
                              </label>
                              <input
                                type="text"
                                value={insurance.claimNumber || ''}
                                onChange={(e) => updateInsurance('liability', index, 'claimNumber', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter claim number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Adjuster
                              </label>
                              <input
                                type="text"
                                value={insurance.adjuster || ''}
                                onChange={(e) => updateInsurance('liability', index, 'adjuster', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter adjuster name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Coverage
                              </label>
                              <input
                                type="text"
                                value={insurance.coverage || ''}
                                onChange={(e) => updateInsurance('liability', index, 'coverage', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter coverage details"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Contact Info
                              </label>
                              <input
                                type="text"
                                value={insurance.contactInfo || ''}
                                onChange={(e) => updateInsurance('liability', index, 'contactInfo', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter contact information"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Notes
                              </label>
                              <textarea
                                value={insurance.notes || ''}
                                onChange={(e) => updateInsurance('liability', index, 'notes', e.target.value)}
                                rows={2}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter additional notes"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Personal Insurance */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-slate-900">Personal Insurance</h4>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => addInsurance('personal')}
                    >
                      Add Personal Insurance
                    </Button>
                  </div>
                  {form.personalInsurance && form.personalInsurance.length > 0 && (
                    <div className="space-y-4">
                      {form.personalInsurance.map((insurance, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="text-sm font-medium text-slate-900">Insurance #{index + 1}</h5>
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              onClick={() => removeInsurance('personal', index)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Insurance Company
                              </label>
                              <input
                                type="text"
                                value={insurance.company}
                                onChange={(e) => updateInsurance('personal', index, 'company', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter insurance company"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Policy Holder
                              </label>
                              <input
                                type="text"
                                value={insurance.policyHolder}
                                onChange={(e) => updateInsurance('personal', index, 'policyHolder', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter policy holder"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Policy Number
                              </label>
                              <input
                                type="text"
                                value={insurance.policyNumber}
                                onChange={(e) => updateInsurance('personal', index, 'policyNumber', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter policy number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Claim Number
                              </label>
                              <input
                                type="text"
                                value={insurance.claimNumber || ''}
                                onChange={(e) => updateInsurance('personal', index, 'claimNumber', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter claim number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Adjuster
                              </label>
                              <input
                                type="text"
                                value={insurance.adjuster || ''}
                                onChange={(e) => updateInsurance('personal', index, 'adjuster', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter adjuster name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Coverage
                              </label>
                              <input
                                type="text"
                                value={insurance.coverage || ''}
                                onChange={(e) => updateInsurance('personal', index, 'coverage', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter coverage details"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Contact Info
                              </label>
                              <input
                                type="text"
                                value={insurance.contactInfo || ''}
                                onChange={(e) => updateInsurance('personal', index, 'contactInfo', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter contact information"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Notes
                              </label>
                              <textarea
                                value={insurance.notes || ''}
                                onChange={(e) => updateInsurance('personal', index, 'notes', e.target.value)}
                                rows={2}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter additional notes"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Other Insurance */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-slate-900">Other Insurance</h4>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => addInsurance('other')}
                    >
                      Add Other Insurance
                    </Button>
                  </div>
                  {form.otherInsurance && form.otherInsurance.length > 0 && (
                    <div className="space-y-4">
                      {form.otherInsurance.map((insurance, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="text-sm font-medium text-slate-900">Insurance #{index + 1}</h5>
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              onClick={() => removeInsurance('other', index)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Insurance Company
                              </label>
                              <input
                                type="text"
                                value={insurance.company}
                                onChange={(e) => updateInsurance('other', index, 'company', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter insurance company"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Policy Holder
                              </label>
                              <input
                                type="text"
                                value={insurance.policyHolder}
                                onChange={(e) => updateInsurance('other', index, 'policyHolder', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter policy holder"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Policy Number
                              </label>
                              <input
                                type="text"
                                value={insurance.policyNumber}
                                onChange={(e) => updateInsurance('other', index, 'policyNumber', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter policy number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Claim Number
                              </label>
                              <input
                                type="text"
                                value={insurance.claimNumber || ''}
                                onChange={(e) => updateInsurance('other', index, 'claimNumber', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter claim number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Adjuster
                              </label>
                              <input
                                type="text"
                                value={insurance.adjuster || ''}
                                onChange={(e) => updateInsurance('other', index, 'adjuster', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter adjuster name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Coverage
                              </label>
                              <input
                                type="text"
                                value={insurance.coverage || ''}
                                onChange={(e) => updateInsurance('other', index, 'coverage', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter coverage details"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Contact Info
                              </label>
                              <input
                                type="text"
                                value={insurance.contactInfo || ''}
                                onChange={(e) => updateInsurance('other', index, 'contactInfo', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter contact information"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Notes
                              </label>
                              <textarea
                                value={insurance.notes || ''}
                                onChange={(e) => updateInsurance('other', index, 'notes', e.target.value)}
                                rows={2}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter additional notes"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Health Insurance */}
                <div>
                  <h4 className="text-md font-medium text-slate-900 mb-3">Health Insurance</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Insurance Company
                        </label>
                        <input
                          type="text"
                          value={form.healthInsurance?.company || ''}
                          onChange={(e) => updateHealthInsurance('company', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter insurance company"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Policy Holder
                        </label>
                        <input
                          type="text"
                          value={form.healthInsurance?.policyHolder || ''}
                          onChange={(e) => updateHealthInsurance('policyHolder', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter policy holder"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Policy Number
                        </label>
                        <input
                          type="text"
                          value={form.healthInsurance?.policyNumber || ''}
                          onChange={(e) => updateHealthInsurance('policyNumber', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter policy number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Claim Number
                        </label>
                        <input
                          type="text"
                          value={form.healthInsurance?.claimNumber || ''}
                          onChange={(e) => updateHealthInsurance('claimNumber', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter claim number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Adjuster
                        </label>
                        <input
                          type="text"
                          value={form.healthInsurance?.adjuster || ''}
                          onChange={(e) => updateHealthInsurance('adjuster', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter adjuster name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Coverage
                        </label>
                        <input
                          type="text"
                          value={form.healthInsurance?.coverage || ''}
                          onChange={(e) => updateHealthInsurance('coverage', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter coverage details"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Contact Info
                        </label>
                        <input
                          type="text"
                          value={form.healthInsurance?.contactInfo || ''}
                          onChange={(e) => updateHealthInsurance('contactInfo', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter contact information"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Notes
                        </label>
                        <textarea
                          value={form.healthInsurance?.notes || ''}
                          onChange={(e) => updateHealthInsurance('notes', e.target.value)}
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter additional notes"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Statute of Limitations Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-900">Statute of Limitations</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowSOLSection(!showSOLSection)}
              >
                {showSOLSection ? 'Hide SOL' : 'Show SOL'}
              </Button>
            </div>

            {showSOLSection && (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        SOL Date *
                      </label>
                      <input
                        type="date"
                        value={form.statuteOfLimitations?.solDate || ''}
                        onChange={(e) => updateStatuteOfLimitations('solDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Statute of limitations deadline"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Claim Type *
                      </label>
                      <select
                        value={form.statuteOfLimitations?.solType || ''}
                        onChange={(e) => updateStatuteOfLimitations('solType', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Type of claim for SOL calculation"
                      >
                        <option value="">Select claim type</option>
                        <option value="personalInjury">Personal Injury</option>
                        <option value="propertyDamage">Property Damage</option>
                        <option value="medicalMalpractice">Medical Malpractice</option>
                        <option value="wrongfulDeath">Wrongful Death</option>
                        <option value="contract">Contract</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={form.statuteOfLimitations?.solState || ''}
                        onChange={(e) => updateStatuteOfLimitations('solState', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="State where SOL applies"
                        title="State jurisdiction for statute of limitations"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Status *
                      </label>
                      <select
                        value={form.statuteOfLimitations?.solStatus || ''}
                        onChange={(e) => updateStatuteOfLimitations('solStatus', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Current SOL status"
                      >
                        <option value="">Select status</option>
                        <option value="active">Active</option>
                        <option value="tolled">Tolled</option>
                        <option value="expired">Expired</option>
                        <option value="preserved">Preserved</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Warning Days
                      </label>
                      <input
                        type="number"
                        value={form.statuteOfLimitations?.solWarningDays || 90}
                        onChange={(e) => updateStatuteOfLimitations('solWarningDays', parseInt(e.target.value) || 90)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="90"
                        title="Days before deadline to show warnings"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Legal Basis
                      </label>
                      <input
                        type="text"
                        value={form.statuteOfLimitations?.solBasis || ''}
                        onChange={(e) => updateStatuteOfLimitations('solBasis', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Legal basis for SOL calculation"
                        title="Legal basis or statute reference"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Tolling Events
                      </label>
                      <input
                        type="text"
                        value={form.statuteOfLimitations?.tollingEvents?.join(', ') || ''}
                        onChange={(e) => updateStatuteOfLimitations('tollingEvents', e.target.value.split(',').map(s => s.trim()))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Minor status, discovery rule, etc."
                        title="Events that may toll the statute of limitations"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        SOL Notes
                      </label>
                      <textarea
                        value={form.statuteOfLimitations?.solNotes || ''}
                        onChange={(e) => updateStatuteOfLimitations('solNotes', e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Additional notes about SOL calculation or status"
                        title="Additional notes about the statute of limitations"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCase ? 'Update Case' : 'Add Case'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}