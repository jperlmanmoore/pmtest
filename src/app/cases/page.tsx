'use client';

import { CasesTable } from '../../components/dashboard/CasesTable';
import { useCases } from '../../hooks/useCases';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CaseForm } from '../../components/forms/CaseForm';
import { Case, CaseFormData } from '../../types';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getStageColor } from '../../utils/helpers';

function CasesPageContent() {
  const { cases, clients, loading, addCase, updateCase, getMainCases } = useCases();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const stageFilter = searchParams.get('stage');
  const filterType = searchParams.get('filter');

  const getStageDisplayName = (stage: string): string => {
    const stageNames: Record<string, string> = {
      intake: 'Intake',
      opening: 'Opening',
      treating: 'Treating',
      demandPrep: 'Demand Prep',
      negotiation: 'Negotiation',
      settlement: 'Settlement',
      resolution: 'Resolution',
      probate: 'Probate',
      closed: 'Closed'
    };
    return stageNames[stage] || stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  const getFilterDisplayName = (filter: string): string => {
    const filterNames: Record<string, string> = {
      urgent: 'SOL Alert Cases',
      recent: 'Recent Cases',
      closed: 'Closed Cases',
      antelitem: 'Ante Litem Cases',
      overyear: 'Cases Over 1 Year',
      solalert: 'SOL Alert Cases'
    };
    return filterNames[filter] || filter.charAt(0).toUpperCase() + filter.slice(1);
  };

  const filteredCases = useMemo(() => {
    let filtered = getMainCases();
    
    // Filter by stage if specified
    if (stageFilter) {
      filtered = filtered.filter(caseItem => caseItem.stage === stageFilter);
    } else {
      // If no stage filter, show all cases (including closed)
      filtered = cases;
    }
    
    // Apply additional filters
    if (filterType === 'urgent') {
      const now = new Date();
      const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(caseItem => {
        if (!caseItem.statuteOfLimitations) return false;
        const solDate = new Date(caseItem.statuteOfLimitations.solDate);
        return solDate <= ninetyDaysFromNow && solDate >= now;
      });
    } else if (filterType === 'recent') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(caseItem => 
        new Date(caseItem.createdAt || caseItem.dateOfLoss) > thirtyDaysAgo
      );
    } else if (filterType === 'closed') {
      filtered = filtered.filter(caseItem => caseItem.stage === 'closed');
    } else if (filterType === 'antelitem') {
      filtered = filtered.filter(caseItem => caseItem.anteLitemRequired);
    } else if (filterType === 'overyear') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      filtered = filtered.filter(caseItem => new Date(caseItem.dateOfLoss) < oneYearAgo);
    } else if (filterType === 'solalert') {
      const now = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      filtered = filtered.filter(caseItem => {
        const sol = new Date(caseItem.dateOfLoss);
        sol.setFullYear(sol.getFullYear() + 2);
        return sol <= sixMonthsFromNow && sol >= now;
      });
    }
    
    return filtered;
  }, [cases, stageFilter, filterType, getMainCases]);

  const clearFilters = () => {
    window.location.href = '/cases';
  };

  const handleEdit = (caseItem: Case) => {
    setEditingCase(caseItem);
    setShowAddForm(true);
  };

  const handleClose = (id: string) => {
    const caseToClose = cases.find(c => c._id === id);
    if (caseToClose) {
      const formData: CaseFormData = {
        clientId: caseToClose.clientId._id,
        caseNumber: caseToClose.caseNumber,
        title: caseToClose.title,
        description: caseToClose.description,
        stage: 'closed',
        dateOfLoss: caseToClose.dateOfLoss,
        anteLitemRequired: caseToClose.anteLitemRequired,
        anteLitemAgency: caseToClose.anteLitemAgency || '',
        anteLitemDeadline: caseToClose.anteLitemDeadline || '',
        parentCaseId: caseToClose.parentCaseId,
        narrative: caseToClose.narrative,
        dateOfIncident: caseToClose.dateOfIncident,
        placeOfIncident: caseToClose.placeOfIncident,
        otherParties: caseToClose.otherParties,
        incidentReportNumber: caseToClose.incidentReportNumber,
        reportingAgency: caseToClose.reportingAgency,
        liabilityInsurance: caseToClose.liabilityInsurance,
        personalInsurance: caseToClose.personalInsurance,
        otherInsurance: caseToClose.otherInsurance,
        healthInsurance: caseToClose.healthInsurance,
        medicalProviders: caseToClose.medicalProviders,
        damages: caseToClose.damages,
        liens: caseToClose.liens,
        statuteOfLimitations: caseToClose.statuteOfLimitations
      };
      updateCase(id, formData);
    }
  };

  const handleRequestClose = (caseId: string, reason: string) => {
    const caseToUpdate = cases.find(c => c._id === caseId);
    if (caseToUpdate) {
      const formData: CaseFormData = {
        clientId: caseToUpdate.clientId._id,
        caseNumber: caseToUpdate.caseNumber,
        title: caseToUpdate.title,
        description: caseToUpdate.description,
        stage: caseToUpdate.stage,
        dateOfLoss: caseToUpdate.dateOfLoss,
        anteLitemRequired: caseToUpdate.anteLitemRequired,
        anteLitemAgency: caseToUpdate.anteLitemAgency || '',
        anteLitemDeadline: caseToUpdate.anteLitemDeadline || '',
        parentCaseId: caseToUpdate.parentCaseId,
        narrative: caseToUpdate.narrative,
        dateOfIncident: caseToUpdate.dateOfIncident,
        placeOfIncident: caseToUpdate.placeOfIncident,
        otherParties: caseToUpdate.otherParties,
        incidentReportNumber: caseToUpdate.incidentReportNumber,
        reportingAgency: caseToUpdate.reportingAgency,
        liabilityInsurance: caseToUpdate.liabilityInsurance,
        personalInsurance: caseToUpdate.personalInsurance,
        otherInsurance: caseToUpdate.otherInsurance,
        healthInsurance: caseToUpdate.healthInsurance,
        medicalProviders: caseToUpdate.medicalProviders,
        damages: caseToUpdate.damages,
        liens: caseToUpdate.liens,
        statuteOfLimitations: caseToUpdate.statuteOfLimitations,
        closeRequested: true,
        closeRequestedBy: 'current-user-id', // In a real app, this would be the current user's ID
        closeRequestedAt: new Date().toISOString(),
        closeRequestReason: reason
      };
      updateCase(caseId, formData);
    }
  };

  const handleApproveClose = (caseId: string) => {
    const caseToClose = cases.find(c => c._id === caseId);
    if (caseToClose) {
      const formData: CaseFormData = {
        clientId: caseToClose.clientId._id,
        caseNumber: caseToClose.caseNumber,
        title: caseToClose.title,
        description: caseToClose.description,
        stage: 'closed',
        dateOfLoss: caseToClose.dateOfLoss,
        anteLitemRequired: caseToClose.anteLitemRequired,
        anteLitemAgency: caseToClose.anteLitemAgency || '',
        anteLitemDeadline: caseToClose.anteLitemDeadline || '',
        parentCaseId: caseToClose.parentCaseId,
        narrative: caseToClose.narrative,
        dateOfIncident: caseToClose.dateOfIncident,
        placeOfIncident: caseToClose.placeOfIncident,
        otherParties: caseToClose.otherParties,
        incidentReportNumber: caseToClose.incidentReportNumber,
        reportingAgency: caseToClose.reportingAgency,
        liabilityInsurance: caseToClose.liabilityInsurance,
        personalInsurance: caseToClose.personalInsurance,
        otherInsurance: caseToClose.otherInsurance,
        healthInsurance: caseToClose.healthInsurance,
        medicalProviders: caseToClose.medicalProviders,
        damages: caseToClose.damages,
        liens: caseToClose.liens,
        statuteOfLimitations: caseToClose.statuteOfLimitations,
        closeRequested: false, // Clear the request after approval
        closeRequestReason: undefined,
        closeRequestedBy: undefined,
        closeRequestedAt: undefined
      };
      updateCase(caseId, formData);
    }
  };

  const handleRejectClose = (caseId: string) => {
    const caseToUpdate = cases.find(c => c._id === caseId);
    if (caseToUpdate) {
      const formData: CaseFormData = {
        clientId: caseToUpdate.clientId._id,
        caseNumber: caseToUpdate.caseNumber,
        title: caseToUpdate.title,
        description: caseToUpdate.description,
        stage: caseToUpdate.stage,
        dateOfLoss: caseToUpdate.dateOfLoss,
        anteLitemRequired: caseToUpdate.anteLitemRequired,
        anteLitemAgency: caseToUpdate.anteLitemAgency || '',
        anteLitemDeadline: caseToUpdate.anteLitemDeadline || '',
        parentCaseId: caseToUpdate.parentCaseId,
        narrative: caseToUpdate.narrative,
        dateOfIncident: caseToUpdate.dateOfIncident,
        placeOfIncident: caseToUpdate.placeOfIncident,
        otherParties: caseToUpdate.otherParties,
        incidentReportNumber: caseToUpdate.incidentReportNumber,
        reportingAgency: caseToUpdate.reportingAgency,
        liabilityInsurance: caseToUpdate.liabilityInsurance,
        personalInsurance: caseToUpdate.personalInsurance,
        otherInsurance: caseToUpdate.otherInsurance,
        healthInsurance: caseToUpdate.healthInsurance,
        medicalProviders: caseToUpdate.medicalProviders,
        damages: caseToUpdate.damages,
        liens: caseToUpdate.liens,
        statuteOfLimitations: caseToUpdate.statuteOfLimitations,
        closeRequested: false, // Clear the request after rejection
        closeRequestReason: undefined,
        closeRequestedBy: undefined,
        closeRequestedAt: undefined
      };
      updateCase(caseId, formData);
    }
  };

  const handleFormSubmit = (formData: CaseFormData) => {
    if (editingCase) {
      updateCase(editingCase._id, formData);
      setEditingCase(null);
    } else {
      addCase(formData);
    }
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading cases...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {stageFilter ? `${getStageDisplayName(stageFilter)} Cases` : 
             filterType ? getFilterDisplayName(filterType) : 'All Cases'}
          </h1>
          {(stageFilter || filterType) && (
            <div className="flex items-center space-x-2 mt-2">
              {stageFilter && (
                <Badge className={getStageColor(stageFilter)}>
                  Filtered by: {getStageDisplayName(stageFilter)}
                </Badge>
              )}
              {filterType && (
                <Badge variant="default">
                  {getFilterDisplayName(filterType)}
                </Badge>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
          {!stageFilter && (
            <div className="flex items-center space-x-2 mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push('/cases?stage=closed')}
              >
                View Closed Cases
              </Button>
            </div>
          )}
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add New Case
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <CaseForm
            clients={clients}
            cases={cases}
            editingCase={editingCase}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowAddForm(false);
              setEditingCase(null);
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <CasesTable
          cases={filteredCases}
          onEdit={handleEdit}
          onClose={handleClose}
          onRequestClose={handleRequestClose}
          onApproveClose={handleApproveClose}
          onRejectClose={handleRejectClose}
        />
      </div>
    </div>
  );
}

export default function CasesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>}>
      <CasesPageContent />
    </Suspense>
  );
}