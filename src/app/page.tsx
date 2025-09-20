'use client';

import { useState } from 'react';
import { Case, CaseFormData } from '../types';
import { useCases } from '../hooks/useCases';
import { calculateMetrics } from '../utils/helpers';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MetricsCards } from '../components/dashboard/MetricsCards';
import { CasesByStageSummary } from '../components/dashboard/CasesByStageSummary';
import { CaseForm } from '../components/forms/CaseForm';

export default function Dashboard() {
  const { cases, clients, loading, addCase, updateCase } = useCases();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  const metrics = calculateMetrics(cases);

  const handleAddCase = () => {
    setShowAddForm(!showAddForm);
    if (showAddForm) {
      setEditingCase(null);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onAddCase={handleAddCase} showAddForm={showAddForm} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MetricsCards metrics={metrics} />

        <CasesByStageSummary cases={cases} />

        {showAddForm && (
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
        )}
      </main>
    </div>
  );
}
