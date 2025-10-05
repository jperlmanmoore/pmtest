'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useUser } from '../../contexts/UserContext';
import { CaseSearch } from './CaseSearch';
import { StatuteOfLimitationsAlert } from './StatuteOfLimitationsAlert';
import { AnteLitemAlert } from './AnteLitemAlert';
import { Case } from '../../types';
import { exportToCSV, exportToJSON, exportToPDF, generateCaseSummaryReport } from '../../utils/exportUtils';

export const AttorneyDashboard = memo(function AttorneyDashboard() {
  const { cases, loading: casesLoading } = useCases();
  const { isAttorney } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Wait for cases to load
      if (!casesLoading) {
        setIsLoading(false);
      }
    } catch {
      setError('Failed to load dashboard data');
      setIsLoading(false);
    }
  }, [casesLoading]);

  // Memoized calculations for performance
  const myCases = useMemo(() =>
    cases.filter(c => c.stage !== 'closed'),
    [cases]
  );

  const urgentCases = useMemo(() =>
    cases.filter(c => {
      if (!c.statuteOfLimitations?.solDate) return false;
      const daysUntilSOL = Math.ceil((new Date(c.statuteOfLimitations.solDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilSOL <= 30;
    }).length,
    [cases]
  );

  const pendingCloseRequests = useMemo(() =>
    cases.filter(c => c.closeRequested && !c.closeRequestedBy).length,
    [cases]
  );

  const casesNeedingReview = useMemo(() =>
    cases.filter(c => c.stage === 'demandPrep' || c.stage === 'negotiation').length,
    [cases]
  );

  const handleCaseSelect = useMemo(() => (caseItem: Case) => {
    // Navigate to case details or open case modal
    console.log('Selected case:', caseItem);
    // You can implement navigation to case details here
  }, []);

  const handleExportCSV = useMemo(() => () => {
    try {
      const filename = `cases-export-${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(cases, filename);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export cases to CSV');
    }
  }, [cases]);

  const handleExportJSON = useMemo(() => () => {
    try {
      const filename = `cases-export-${new Date().toISOString().split('T')[0]}.json`;
      exportToJSON(cases, filename);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export cases to JSON');
    }
  }, [cases]);

  const handleExportPDF = useMemo(() => async () => {
    try {
      const filename = `cases-report-${new Date().toISOString().split('T')[0]}.pdf`;
      await exportToPDF(cases, filename);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export cases to PDF');
    }
  }, [cases]);

  if (!isAttorney) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" aria-hidden="true"></div>
        <span className="ml-3 text-slate-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" role="alert" aria-live="assertive">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 mb-4" aria-hidden="true">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="secondary" aria-label="Retry loading dashboard">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Attorney Dashboard</h1>
        <p className="text-slate-600">Manage your cases and track important deadlines</p>
      </header>

      <section aria-labelledby="case-search">
        <CaseSearch
          cases={cases}
          onCaseSelect={handleCaseSelect}
          placeholder="Search cases by case number or client name..."
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statute of Limitations Alert */}
        <section aria-labelledby="sol-alert">
          <StatuteOfLimitationsAlert />
        </section>

        {/* Ante Litem Alert */}
        <section aria-labelledby="ante-litem-alert">
          <AnteLitemAlert title="My Cases Requiring Ante Litem Notice" />
        </section>

        {/* Case Load Overview */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">My Case Load</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Active Cases</span>
                <Badge variant="default" aria-label={`${myCases.length} active cases`}>{myCases.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Urgent Deadlines (&lt;30 days)</span>
                <Badge variant="danger" aria-label={`${urgentCases} cases with urgent deadlines`}>{urgentCases}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Pending Close Requests</span>
                <Badge variant="warning" aria-label={`${pendingCloseRequests} pending close requests`}>{pendingCloseRequests}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Cases Needing Review</span>
                <Badge variant="warning" aria-label={`${casesNeedingReview} cases needing review`}>{casesNeedingReview}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgent Cases */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Urgent Cases</h2>
              <Badge variant="danger" aria-label={`${urgentCases} urgent cases`}>{urgentCases}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cases.filter(c => {
                if (!c.statuteOfLimitations?.solDate) return false;
                const daysUntilSOL = Math.ceil((new Date(c.statuteOfLimitations.solDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return daysUntilSOL <= 30;
              }).slice(0, 3).map(caseItem => (
                <div key={caseItem._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{caseItem.title}</p>
                    <p className="text-sm text-slate-600">
                      SOL: {new Date(caseItem.statuteOfLimitations!.solDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm" variant="danger" aria-label={`Review case ${caseItem.title}`}>Review</Button>
                </div>
              ))}
              {urgentCases === 0 && (
                <p className="text-slate-500 text-center py-4">No urgent cases</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <section aria-labelledby="export-section">
          <Card>
            <CardHeader>
              <h2 id="export-section" className="text-lg font-semibold text-slate-900">Export Data</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Export your case data in various formats for reporting and backup purposes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={handleExportCSV}
                  aria-label="Export cases to CSV file"
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleExportJSON}
                  aria-label="Export cases to JSON file"
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Export JSON
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleExportPDF}
                  aria-label="Export cases to PDF report"
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {cases.length} cases will be exported
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
});