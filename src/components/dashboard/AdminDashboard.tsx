'use client';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useUser } from '../../contexts/UserContext';
import { CaseSearch } from './CaseSearch';
import { Case } from '../../types';

export function AdminDashboard() {
  const { cases } = useCases();
  const { isAdmin } = useUser();

  // Calculate admin-specific metrics
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

  const handleCaseSelect = (caseItem: Case) => {
    // Navigate to case details or open case modal
    console.log('Selected case:', caseItem);
    // You can implement navigation to case details here
  };

  if (!isAdmin) return null;

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

      {/* System Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Urgent Cases (SOL &lt; 90 days)</span>
              <Badge variant="danger">{urgentCases}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>New Cases (Last 30 days)</span>
              <Badge variant="success">{recentCases}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Active Cases</span>
              <Badge>{cases.filter(c => c.stage !== 'closed').length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>System Health</span>
              <Badge variant="success">Good</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-blue-600">Active Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-600">Attorneys</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-purple-600">Staff Members</div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="secondary">Manage Users</Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}