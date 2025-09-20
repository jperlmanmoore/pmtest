'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Case } from '../../../types';
import { useCases } from '../../../hooks/useCases';
import { useTasks } from '../../../hooks/useTasks';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { TaskList } from '../../../components/TaskList';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { cases, loading, getWitnessesForCase } = useCases();
  const { tasks, updateTask, deleteTask, loading: tasksLoading } = useTasks(params.id as string);
  const [caseData, setCaseData] = useState<Case | null>(null);

  useEffect(() => {
    if (params.id && cases.length > 0) {
      const foundCase = cases.find(c => c._id === params.id);
      if (foundCase) {
        setCaseData(foundCase);
      }
    }
  }, [params.id, cases]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading case details...</p>
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'intake': return 'bg-blue-100 text-blue-800';
      case 'treating': return 'bg-green-100 text-green-800';
      case 'settlement': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Button
                onClick={() => router.push('/')}
                variant="secondary"
                className="mb-4"
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">{caseData.title}</h1>
              <p className="text-gray-600 mt-1">Case Number: {caseData.caseNumber}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getStageColor(caseData.stage)}>
                {caseData.stage}
              </Badge>
              <Button onClick={() => router.push(`/cases/${caseData._id}/edit`)}>
                Edit Case
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <p className="mt-1 text-sm text-gray-900">{caseData.clientId.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Loss</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(caseData.dateOfLoss).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{caseData.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ante Litem Required</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {caseData.anteLitemRequired ? 'Yes' : 'No'}
                    </p>
                  </div>
                  {caseData.anteLitemRequired && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ante Litem Agency</label>
                        <p className="mt-1 text-sm text-gray-900">{caseData.anteLitemAgency}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ante Litem Deadline</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {caseData.anteLitemDeadline ? new Date(caseData.anteLitemDeadline).toLocaleDateString() : 'N/A'}
                        </p>
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
              <CardContent className="space-y-4">
                {caseData.narrative && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Narrative</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{caseData.narrative}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {caseData.dateOfIncident && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Incident</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(caseData.dateOfIncident).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {caseData.placeOfIncident && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Place of Incident</label>
                      <p className="mt-1 text-sm text-gray-900">{caseData.placeOfIncident}</p>
                    </div>
                  )}

                  {caseData.incidentReportNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Incident Report Number</label>
                      <p className="mt-1 text-sm text-gray-900">{caseData.incidentReportNumber}</p>
                    </div>
                  )}

                  {caseData.reportingAgency && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reporting Agency</label>
                      <p className="mt-1 text-sm text-gray-900">{caseData.reportingAgency}</p>
                    </div>
                  )}
                </div>

                {caseData.otherParties && caseData.otherParties.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Other Parties</label>
                    <div className="mt-1 space-y-1">
                      {caseData.otherParties.map((party, index) => (
                        <p key={index} className="text-sm text-gray-900">• {party}</p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medical Providers */}
            {caseData.medicalProviders && caseData.medicalProviders.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Medical Providers</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {caseData.medicalProviders.map((provider, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <p className="mt-1 text-sm text-gray-900">{provider.name}</p>
                          </div>
                          {provider.specialty && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Specialty</label>
                              <p className="mt-1 text-sm text-gray-900">{provider.specialty}</p>
                            </div>
                          )}
                          {provider.facility && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Facility</label>
                              <p className="mt-1 text-sm text-gray-900">{provider.facility}</p>
                            </div>
                          )}
                          {provider.contactInfo && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Contact Info</label>
                              <p className="mt-1 text-sm text-gray-900">{provider.contactInfo}</p>
                            </div>
                          )}
                        </div>
                        {provider.notes && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <p className="mt-1 text-sm text-gray-900">{provider.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Task Management */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Task Management</h2>
              </CardHeader>
              <CardContent>
                <TaskList
                  tasks={tasks}
                  onTaskUpdate={updateTask}
                  onTaskDelete={deleteTask}
                  loading={tasksLoading}
                />
              </CardContent>
            </Card>

            {/* Witnesses */}
            {(() => {
              const witnesses = getWitnessesForCase(caseData._id);
              return witnesses.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900">Witnesses</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {witnesses.map((witness) => (
                        <div key={witness._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/cases/${witness._id}`)}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-900">{witness.clientId.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{witness.title}</p>
                              <p className="text-sm text-gray-500 mt-1">{witness.description}</p>
                            </div>
                            <Badge className={getStageColor(witness.stage)}>
                              {witness.stage}
                            </Badge>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            Date of Loss: {new Date(witness.dateOfLoss).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Insurance Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Insurance Information</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Liability Insurance */}
                {caseData.liabilityInsurance && caseData.liabilityInsurance.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Liability Insurance</h3>
                    <div className="space-y-3">
                      {caseData.liabilityInsurance.map((insurance, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <p className="font-medium text-gray-900">{insurance.company}</p>
                          <p className="text-sm text-gray-600">Policy Holder: {insurance.policyHolder}</p>
                          <p className="text-sm text-gray-600">Policy: {insurance.policyNumber}</p>
                          {insurance.claimNumber && (
                            <p className="text-sm text-gray-600">Claim: {insurance.claimNumber}</p>
                          )}
                          {insurance.adjuster && (
                            <p className="text-sm text-gray-600">Adjuster: {insurance.adjuster}</p>
                          )}
                          {insurance.coverage && (
                            <p className="text-sm text-gray-600">Coverage: {insurance.coverage}</p>
                          )}
                          {insurance.contactInfo && (
                            <p className="text-sm text-gray-600">Contact: {insurance.contactInfo}</p>
                          )}
                          {insurance.notes && (
                            <p className="text-sm text-gray-600 mt-1">Notes: {insurance.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personal Insurance */}
                {caseData.personalInsurance && caseData.personalInsurance.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Insurance</h3>
                    <div className="space-y-3">
                      {caseData.personalInsurance.map((insurance, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <p className="font-medium text-gray-900">{insurance.company}</p>
                          <p className="text-sm text-gray-600">Policy Holder: {insurance.policyHolder}</p>
                          <p className="text-sm text-gray-600">Policy: {insurance.policyNumber}</p>
                          {insurance.claimNumber && (
                            <p className="text-sm text-gray-600">Claim: {insurance.claimNumber}</p>
                          )}
                          {insurance.adjuster && (
                            <p className="text-sm text-gray-600">Adjuster: {insurance.adjuster}</p>
                          )}
                          {insurance.coverage && (
                            <p className="text-sm text-gray-600">Coverage: {insurance.coverage}</p>
                          )}
                          {insurance.contactInfo && (
                            <p className="text-sm text-gray-600">Contact: {insurance.contactInfo}</p>
                          )}
                          {insurance.notes && (
                            <p className="text-sm text-gray-600 mt-1">Notes: {insurance.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Health Insurance */}
                {caseData.healthInsurance && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Health Insurance</h3>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="font-medium text-gray-900">{caseData.healthInsurance.company}</p>
                      <p className="text-sm text-gray-600">Policy Holder: {caseData.healthInsurance.policyHolder}</p>
                      <p className="text-sm text-gray-600">Policy: {caseData.healthInsurance.policyNumber}</p>
                      {caseData.healthInsurance.claimNumber && (
                        <p className="text-sm text-gray-600">Claim: {caseData.healthInsurance.claimNumber}</p>
                      )}
                      {caseData.healthInsurance.adjuster && (
                        <p className="text-sm text-gray-600">Adjuster: {caseData.healthInsurance.adjuster}</p>
                      )}
                      {caseData.healthInsurance.coverage && (
                        <p className="text-sm text-gray-600">Coverage: {caseData.healthInsurance.coverage}</p>
                      )}
                      {caseData.healthInsurance.contactInfo && (
                        <p className="text-sm text-gray-600">Contact: {caseData.healthInsurance.contactInfo}</p>
                      )}
                      {caseData.healthInsurance.notes && (
                        <p className="text-sm text-gray-600 mt-1">Notes: {caseData.healthInsurance.notes}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Damages */}
            {caseData.damages && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Damages</h2>
                </CardHeader>
                <CardContent className="space-y-3">
                  {caseData.damages.propertyDamage && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Property Damage:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${caseData.damages.propertyDamage.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {caseData.damages.medicalExpenses && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Medical Expenses:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${caseData.damages.medicalExpenses.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {caseData.damages.lostWages && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Lost Wages:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${caseData.damages.lostWages.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {caseData.damages.painAndSuffering && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pain & Suffering:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${caseData.damages.painAndSuffering.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {caseData.damages.totalEstimated && (
                    <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                      <span className="text-sm font-medium text-gray-900">Total Estimated:</span>
                      <span className="text-sm font-bold text-gray-900">
                        ${caseData.damages.totalEstimated.toLocaleString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Liens */}
            {caseData.liens && caseData.liens.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Liens</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {caseData.liens.map((lien, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{lien.holder}</p>
                            <p className="text-sm text-gray-600">{lien.type}</p>
                            {lien.priority && (
                              <p className="text-sm text-gray-600">Priority: {lien.priority}</p>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            ${lien.amount.toLocaleString()}
                          </span>
                        </div>
                        {lien.notes && (
                          <p className="text-sm text-gray-600 mt-2">{lien.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statute of Limitations */}
            {caseData.statuteOfLimitations && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Statute of Limitations</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SOL Date</label>
                      <p className="mt-1 text-sm text-gray-900 font-medium">
                        {new Date(caseData.statuteOfLimitations.solDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className={`mt-1 text-sm font-medium ${
                        caseData.statuteOfLimitations.solStatus === 'active' ? 'text-green-600' :
                        caseData.statuteOfLimitations.solStatus === 'expired' ? 'text-red-600' :
                        caseData.statuteOfLimitations.solStatus === 'tolled' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {caseData.statuteOfLimitations.solStatus.charAt(0).toUpperCase() + caseData.statuteOfLimitations.solStatus.slice(1)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Claim Type</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {caseData.statuteOfLimitations.solType === 'personalInjury' ? 'Personal Injury' :
                         caseData.statuteOfLimitations.solType === 'propertyDamage' ? 'Property Damage' :
                         caseData.statuteOfLimitations.solType === 'medicalMalpractice' ? 'Medical Malpractice' :
                         caseData.statuteOfLimitations.solType === 'wrongfulDeath' ? 'Wrongful Death' :
                         caseData.statuteOfLimitations.solType === 'contract' ? 'Contract' :
                         'Other'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <p className="mt-1 text-sm text-gray-900">{caseData.statuteOfLimitations.solState}</p>
                    </div>
                  </div>

                  {caseData.statuteOfLimitations.solBasis && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Legal Basis</label>
                      <p className="mt-1 text-sm text-gray-900">{caseData.statuteOfLimitations.solBasis}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Warning Period</label>
                    <p className="mt-1 text-sm text-gray-900">{caseData.statuteOfLimitations.solWarningDays} days before deadline</p>
                  </div>

                  {caseData.statuteOfLimitations.tollingEvents && caseData.statuteOfLimitations.tollingEvents.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tolling Events</label>
                      <div className="mt-1">
                        {caseData.statuteOfLimitations.tollingEvents.map((event, index) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {caseData.statuteOfLimitations.solNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="mt-1 text-sm text-gray-900">{caseData.statuteOfLimitations.solNotes}</p>
                    </div>
                  )}

                  {/* SOL Status Warning */}
                  {(() => {
                    const solDate = new Date(caseData.statuteOfLimitations.solDate);
                    const today = new Date();
                    const warningDate = new Date(solDate);
                    warningDate.setDate(solDate.getDate() - caseData.statuteOfLimitations.solWarningDays);
                    
                    const daysUntilDeadline = Math.ceil((solDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    const isWithinWarning = today >= warningDate && today <= solDate;
                    const isExpired = today > solDate;

                    if (isExpired) {
                      return (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">SOL Expired</h3>
                              <p className="text-sm text-red-700 mt-1">
                                The statute of limitations expired on {solDate.toLocaleDateString()}.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (isWithinWarning) {
                      return (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800">SOL Warning</h3>
                              <p className="text-sm text-yellow-700 mt-1">
                                {daysUntilDeadline} days remaining until SOL deadline ({solDate.toLocaleDateString()}).
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}