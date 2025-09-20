'use client';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useUser } from '../../contexts/UserContext';
import { CaseSearch } from './CaseSearch';
import { Case } from '../../types';

export function ManagerDashboard() {
  const { cases } = useCases();
  const { isManager } = useUser();

  // Calculate manager-specific metrics
  const pendingCloseRequests = cases.filter(c => c.closeRequested && !c.stage?.includes('closed')).length;
  const urgentCases = cases.filter(c => {
    if (!c.statuteOfLimitations) return false;
    const solDate = new Date(c.statuteOfLimitations.solDate);
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    return solDate <= ninetyDaysFromNow;
  }).length;

  const recentCases = cases.filter(c => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(c.createdAt || c.dateOfLoss) > thirtyDaysAgo;
  }).length;

  const activeCases = cases.filter(c => c.stage !== 'closed').length;
  const casesByStage = cases.reduce((acc, caseItem) => {
    acc[caseItem.stage] = (acc[caseItem.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCaseSelect = (caseItem: Case) => {
    // Navigate to case details or open case modal
    console.log('Selected case:', caseItem);
    // You can implement navigation to case details here
  };

  if (!isManager) return null;

  return (
    <div className="space-y-6">
      <CaseSearch
        cases={cases}
        onCaseSelect={handleCaseSelect}
        placeholder="Search cases by case number or client name..."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
            <Badge variant="warning">{pendingCloseRequests}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cases.filter(c => c.closeRequested && !c.stage?.includes('closed')).slice(0, 3).map(caseItem => (
              <div key={caseItem._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-sm text-gray-600">Requested by: {caseItem.closeRequestedBy || 'Unknown'}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="primary">Approve</Button>
                  <Button size="sm" variant="danger">Reject</Button>
                </div>
              </div>
            ))}
            {pendingCloseRequests === 0 && (
              <p className="text-gray-500 text-center py-4">No pending approvals</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Case Distribution */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Case Distribution</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(casesByStage).map(([stage, count]) => (
              <div key={stage} className="flex justify-between items-center">
                <span className="capitalize">{stage.replace(/([A-Z])/g, ' $1').trim()}</span>
                <Badge variant="default">{count}</Badge>
              </div>
            ))}
            <div className="flex justify-between items-center border-t pt-2">
              <span className="font-medium">Total Active</span>
              <Badge variant="success">{activeCases}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Overview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Management Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activeCases}</div>
              <div className="text-sm text-blue-600">Active Cases</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{urgentCases}</div>
              <div className="text-sm text-red-600">Urgent Cases</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{recentCases}</div>
              <div className="text-sm text-green-600">New This Month</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{pendingCloseRequests}</div>
              <div className="text-sm text-yellow-600">Pending Closes</div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="primary">Generate Reports</Button>
            <Button variant="secondary">Staff Assignments</Button>
            <Button variant="secondary">Performance Metrics</Button>
            <Button variant="secondary">Resource Planning</Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}