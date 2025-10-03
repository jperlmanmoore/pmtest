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
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { useUser } from '../../contexts/UserContext';

function CasesPageContent() {
  const { cases, clients, loading, addCase, updateCase, getMainCases } = useCases();
  const { isIntake } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const stageFilter = searchParams?.get('stage');
  const filterType = searchParams?.get('filter');

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
    
    // For intake users, only show intake-stage cases
    if (isIntake) {
      filtered = filtered.filter(caseItem => caseItem.stage === 'intake');
    }
    
    // Filter by stage if specified
    if (stageFilter) {
      filtered = filtered.filter(caseItem => caseItem.stage === stageFilter);
    } else {
      // If no stage filter, show all cases (including closed) for non-intake users
      if (!isIntake) {
        filtered = cases;
      }
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
  }, [cases, stageFilter, filterType, getMainCases, isIntake]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onAddCase={() => setShowAddForm(true)} showAddForm={showAddForm} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {stageFilter ? `${getStageDisplayName(stageFilter)} Cases` : 
             filterType ? getFilterDisplayName(filterType) : 'All Cases'}
          </h1>
          <p className="text-gray-600 mt-1">
            {(stageFilter || filterType) ? 
              'Filtered view of cases' :
              'Complete list of all cases in the system'
            }
          </p>
          {(stageFilter || filterType) && (
            <div className="flex items-center space-x-2 mt-3">
              {stageFilter && (
                <Badge className={getStageColor(stageFilter)}>
                  Stage: {getStageDisplayName(stageFilter)}
                </Badge>
              )}
              {filterType && (
                <Badge variant="default">
                  Filter: {getFilterDisplayName(filterType)}
                </Badge>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push('/cases')}
              >
                Clear Filters
              </Button>
            </div>
          )}
          {!stageFilter && !filterType && (
            <div className="flex items-center space-x-2 mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push('/cases?stage=closed')}
              >
                View Closed Cases
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push('/overview')}
              >
                📊 Task Overview
              </Button>
            </div>
          )}
        </div>

        {showAddForm && (
          <div className="mb-6">
            <CaseForm
              clients={clients}
              cases={isIntake ? filteredCases : cases}
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
          />
        </div>
      </main>
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