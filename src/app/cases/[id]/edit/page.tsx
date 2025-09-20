'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Case, CaseFormData, Insurance, MedicalProvider } from '../../../../types';
import { useCases } from '../../../../hooks/useCases';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../../components/ui/Card';
import { InsuranceForm } from '../../../../components/forms/InsuranceForm';
import { MedicalProviderForm } from '../../../../components/forms/MedicalProviderForm';

export default function EditCasePage() {
  const params = useParams();
  const router = useRouter();
  const { cases, clients, loading, updateCase } = useCases();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [formData, setFormData] = useState<CaseFormData>({
    clientId: '',
    caseNumber: '',
    title: '',
    description: '',
    stage: 'intake',
    dateOfLoss: '',
    anteLitemRequired: false,
    anteLitemAgency: '',
    anteLitemDeadline: '',
    narrative: '',
    dateOfIncident: '',
    placeOfIncident: '',
    otherParties: [],
    incidentReportNumber: '',
    reportingAgency: '',
    liabilityInsurance: [],
    personalInsurance: [],
    otherInsurance: [],
    medicalProviders: [],
    damages: {
      propertyDamage: 0,
      medicalExpenses: 0,
      lostWages: 0,
      painAndSuffering: 0,
      otherDamages: 0,
      totalEstimated: 0,
      notes: '',
    },
    liens: [],
  });

  useEffect(() => {
    if (params.id && cases.length > 0) {
      const foundCase = cases.find(c => c._id === params.id);
      if (foundCase) {
        setCaseData(foundCase);
        setFormData({
          clientId: foundCase.clientId._id,
          caseNumber: foundCase.caseNumber,
          title: foundCase.title,
          description: foundCase.description,
          stage: foundCase.stage,
          dateOfLoss: foundCase.dateOfLoss,
          anteLitemRequired: foundCase.anteLitemRequired,
          anteLitemAgency: foundCase.anteLitemAgency || '',
          anteLitemDeadline: foundCase.anteLitemDeadline || '',
          narrative: foundCase.narrative || '',
          dateOfIncident: foundCase.dateOfIncident || '',
          placeOfIncident: foundCase.placeOfIncident || '',
          otherParties: foundCase.otherParties || [],
          incidentReportNumber: foundCase.incidentReportNumber || '',
          reportingAgency: foundCase.reportingAgency || '',
          liabilityInsurance: foundCase.liabilityInsurance || [],
          personalInsurance: foundCase.personalInsurance || [],
          otherInsurance: foundCase.otherInsurance || [],
          healthInsurance: foundCase.healthInsurance,
          medicalProviders: foundCase.medicalProviders || [],
          damages: foundCase.damages || {
            propertyDamage: 0,
            medicalExpenses: 0,
            lostWages: 0,
            painAndSuffering: 0,
            otherDamages: 0,
            totalEstimated: 0,
            notes: '',
          },
          liens: foundCase.liens || [],
        });
      }
    }
  }, [params.id, cases]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (caseData && params.id) {
      updateCase(params.id as string, formData);
      router.push(`/cases/${params.id}`);
    }
  };

  const addInsurance = (type: 'liability' | 'personal' | 'other') => {
    const newInsurance: Insurance = {
      company: '',
      policyHolder: '',
      policyNumber: '',
      coverage: '',
      contactInfo: '',
      notes: '',
    };

    if (type === 'liability') {
      setFormData(prev => ({
        ...prev,
        liabilityInsurance: [...(prev.liabilityInsurance || []), newInsurance],
      }));
    } else if (type === 'personal') {
      setFormData(prev => ({
        ...prev,
        personalInsurance: [...(prev.personalInsurance || []), newInsurance],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        otherInsurance: [...(prev.otherInsurance || []), newInsurance],
      }));
    }
  };

  const updateInsurance = (type: 'liability' | 'personal' | 'other', index: number, field: keyof Insurance, value: string) => {
    const updateArray = (array: Insurance[] | undefined) => {
      if (!array) return [];
      const updated = [...array];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    };

    if (type === 'liability') {
      setFormData(prev => ({
        ...prev,
        liabilityInsurance: updateArray(prev.liabilityInsurance),
      }));
    } else if (type === 'personal') {
      setFormData(prev => ({
        ...prev,
        personalInsurance: updateArray(prev.personalInsurance),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        otherInsurance: updateArray(prev.otherInsurance),
      }));
    }
  };

  const removeInsurance = (type: 'liability' | 'personal' | 'other', index: number) => {
    const removeFromArray = (array: Insurance[] | undefined) => {
      if (!array) return [];
      return array.filter((_, i) => i !== index);
    };

    if (type === 'liability') {
      setFormData(prev => ({
        ...prev,
        liabilityInsurance: removeFromArray(prev.liabilityInsurance),
      }));
    } else if (type === 'personal') {
      setFormData(prev => ({
        ...prev,
        personalInsurance: removeFromArray(prev.personalInsurance),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        otherInsurance: removeFromArray(prev.otherInsurance),
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading case...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500">Case not found</div>
          <Button onClick={() => router.push('/')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Button
                onClick={() => router.push(`/cases/${params.id}`)}
                variant="secondary"
                className="mb-4"
              >
                ← Back to Case Details
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Edit Case</h1>
              <p className="text-gray-600 mt-1">{caseData.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Case Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Case Title"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Case Description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Loss
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfLoss}
                    onChange={(e) => setFormData({ ...formData, dateOfLoss: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Date of Loss"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.anteLitemRequired}
                      onChange={(e) => setFormData({ ...formData, anteLitemRequired: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Ante Litem Required
                    </span>
                  </label>
                </div>

                {formData.anteLitemRequired && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ante Litem Agency
                      </label>
                      <input
                        type="text"
                        value={formData.anteLitemAgency}
                        onChange={(e) => setFormData({ ...formData, anteLitemAgency: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Ante Litem Agency"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ante Litem Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.anteLitemDeadline}
                        onChange={(e) => setFormData({ ...formData, anteLitemDeadline: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Ante Litem Deadline"
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Initial Call Data */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Initial Call Data</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Narrative
                </label>
                <textarea
                  value={formData.narrative}
                  onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed narrative of the incident..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Incident
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfIncident}
                    onChange={(e) => setFormData({ ...formData, dateOfIncident: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Date of Incident"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place of Incident
                  </label>
                  <input
                    type="text"
                    value={formData.placeOfIncident}
                    onChange={(e) => setFormData({ ...formData, placeOfIncident: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Location of incident"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incident Report Number
                  </label>
                  <input
                    type="text"
                    value={formData.incidentReportNumber}
                    onChange={(e) => setFormData({ ...formData, incidentReportNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Report number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting Agency
                  </label>
                  <input
                    type="text"
                    value={formData.reportingAgency}
                    onChange={(e) => setFormData({ ...formData, reportingAgency: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Agency that made the report"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Parties Involved
                </label>
                <textarea
                  value={formData.otherParties?.join('\n') || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    otherParties: e.target.value.split('\n').filter(party => party.trim() !== '')
                  })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="One party per line"
                />
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Insurance Information</h2>
            </CardHeader>
            <CardContent className="space-y-8">
              <InsuranceForm
                insurance={formData.liabilityInsurance || []}
                type="liability"
                onAdd={() => addInsurance('liability')}
                onUpdate={(index, field, value) => updateInsurance('liability', index, field, value)}
                onRemove={(index) => removeInsurance('liability', index)}
              />

              <InsuranceForm
                insurance={formData.personalInsurance || []}
                type="personal"
                onAdd={() => addInsurance('personal')}
                onUpdate={(index, field, value) => updateInsurance('personal', index, field, value)}
                onRemove={(index) => removeInsurance('personal', index)}
              />
            </CardContent>
          </Card>

          {/* Medical Providers */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Medical Providers</h2>
            </CardHeader>
            <CardContent>
              <MedicalProviderForm
                providers={formData.medicalProviders || []}
                onAdd={() => {
                  const newProvider: MedicalProvider = {
                    name: '',
                    specialty: '',
                    contactInfo: '',
                    facility: '',
                    notes: '',
                  };
                  setFormData(prev => ({
                    ...prev,
                    medicalProviders: [...(prev.medicalProviders || []), newProvider],
                  }));
                }}
                onUpdate={(index, field, value) => {
                  setFormData(prev => {
                    const updated = [...(prev.medicalProviders || [])];
                    updated[index] = { ...updated[index], [field]: value };
                    return { ...prev, medicalProviders: updated };
                  });
                }}
                onRemove={(index) => {
                  setFormData(prev => ({
                    ...prev,
                    medicalProviders: (prev.medicalProviders || []).filter((_, i) => i !== index),
                  }));
                }}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => router.push(`/cases/${params.id}`)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}