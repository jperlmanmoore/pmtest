'use client';

import { useState } from 'react';
import { Case, CaseFormData } from '../types';
import { useCases } from '../hooks/useCases';
import { calculateMetrics } from '../utils/helpers';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MetricsCards } from '../components/dashboard/MetricsCards';
import { CasesByStageSummary } from '../components/dashboard/CasesByStageSummary';
import { CaseForm } from '../components/forms/CaseForm';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { IntakeDashboard } from '../components/dashboard/IntakeDashboard';
import { CaseManagerDashboard } from '../components/dashboard/CaseManagerDashboard';
import { AccountantDashboard } from '../components/dashboard/AccountantDashboard';
import { AttorneyDashboard } from '../components/dashboard/AttorneyDashboard';
import { ManagerDashboard } from '../components/dashboard/ManagerDashboard';
import { QualityControlDashboard } from '../components/dashboard/QualityControlDashboard';
import { useUser } from '../contexts/UserContext';

export default function Dashboard() {
  const { cases, clients, loading, addCase, updateCase } = useCases();
  const { isIntake, isManager, isQualityControl } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  const metrics = calculateMetrics(cases);

  // Filter cases for intake users to only show intake-stage cases
  const displayCases = isIntake ? cases.filter(c => c.stage === 'intake') : cases;
  const displayMetrics = isIntake ? calculateMetrics(displayCases) : metrics;

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
        {!isIntake && <MetricsCards metrics={displayMetrics} />}

        {!isIntake && !isQualityControl && <CasesByStageSummary cases={displayCases} />}

        {/* Role-Specific Dashboards */}
        <AdminDashboard />
        <ManagerDashboard />
        <QualityControlDashboard />
        <IntakeDashboard />
        <CaseManagerDashboard />
        <AccountantDashboard />
        <AttorneyDashboard />

        {showAddForm && (
          <CaseForm
            clients={clients}
            cases={displayCases}
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
