'use client';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useUser } from '../../contexts/UserContext';
import { CaseSearch } from './CaseSearch';
import { Case } from '../../types';

export function AttorneyDashboard() {
  const { cases } = useCases();
  const { isAttorney } = useUser();

  // Calculate attorney-specific metrics
  const myCases = cases.filter(c => c.stage !== 'closed'); // For now, show all non-closed cases
  const urgentCases = cases.filter(c => {
    if (!c.statuteOfLimitations?.solDate) return false;
    const daysUntilSOL = Math.ceil((new Date(c.statuteOfLimitations.solDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilSOL <= 30;
  }).length;
  const pendingCloseRequests = cases.filter(c => c.closeRequested && !c.closeRequestedBy).length; // Cases with close requested but not processed
  const casesNeedingReview = cases.filter(c => c.stage === 'demandPrep' || c.stage === 'negotiation').length;

  const handleCaseSelect = (caseItem: Case) => {
    // Navigate to case details or open case modal
    console.log('Selected case:', caseItem);
    // You can implement navigation to case details here
  };

  if (!isAttorney) return null;

  return (
    <div className="space-y-6">
      <CaseSearch
        cases={cases}
        onCaseSelect={handleCaseSelect}
        placeholder="Search cases by case number or client name..."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Case Load Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">My Case Load</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Active Cases</span>
              <Badge variant="default">{myCases.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Urgent Deadlines (&lt;30 days)</span>
              <Badge variant="danger">{urgentCases}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending Close Requests</span>
              <Badge variant="warning">{pendingCloseRequests}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Cases Needing Review</span>
              <Badge variant="warning">{casesNeedingReview}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Cases */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Urgent Cases</h3>
            <Badge variant="danger">{urgentCases}</Badge>
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
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-sm text-gray-600">
                    SOL: {new Date(caseItem.statuteOfLimitations!.solDate).toLocaleDateString()}
                  </p>
                </div>
                <Button size="sm" variant="danger">Review</Button>
              </div>
            ))}
            {urgentCases === 0 && (
              <p className="text-gray-500 text-center py-4">No urgent cases</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Case Management Actions */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Case Management</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{myCases.length}</div>
              <div className="text-sm text-blue-600">My Cases</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{pendingCloseRequests}</div>
              <div className="text-sm text-yellow-600">Pending Closes</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{casesNeedingReview}</div>
              <div className="text-sm text-green-600">Need Review</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{urgentCases}</div>
              <div className="text-sm text-purple-600">Urgent</div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="primary">Submit Close Request</Button>
            <Button variant="secondary">Case Assignments</Button>
            <Button variant="secondary">Court Calendar</Button>
            <Button variant="secondary">Document Review</Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}