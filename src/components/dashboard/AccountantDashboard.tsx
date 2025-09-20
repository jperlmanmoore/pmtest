'use client';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useUser } from '../../contexts/UserContext';
import { CaseSearch } from './CaseSearch';
import { Case } from '../../types';

export function AccountantDashboard() {
  const { cases } = useCases();
  const { isAccountant } = useUser();

  // Calculate accountant-specific metrics
  const casesWithLiens = cases.filter(c => c.liens && c.liens.length > 0).length;
  const pendingInvoices = cases.filter(c => c.stage === 'settlement' || c.stage === 'resolution').length;
  const highValueCases = cases.filter(c => {
    const damages = c.damages;
    if (!damages) return false;
    const totalValue = (damages.medicalExpenses || 0) + (damages.lostWages || 0) + (damages.painAndSuffering || 0);
    return totalValue > 50000; // Cases over $50k
  }).length;

  const handleCaseSelect = (caseItem: Case) => {
    // Navigate to case details or open case modal
    console.log('Selected case:', caseItem);
    // You can implement navigation to case details here
  };

  if (!isAccountant) return null;

  return (
    <div className="space-y-6">
      <CaseSearch
        cases={cases}
        onCaseSelect={handleCaseSelect}
        placeholder="Search cases by case number or client name..."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Cases with Liens</span>
              <Badge variant="warning">{casesWithLiens}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending Settlements</span>
              <Badge variant="success">{pendingInvoices}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>High-Value Cases (&gt;$50k)</span>
              <Badge variant="danger">{highValueCases}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Monthly Revenue</span>
              <Badge>$125,000</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pending Invoices</h3>
            <Badge variant="warning">{pendingInvoices}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cases.filter(c => c.stage === 'settlement' || c.stage === 'resolution').slice(0, 3).map(caseItem => (
              <div key={caseItem._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-sm text-gray-600">Stage: {caseItem.stage}</p>
                </div>
                <Button size="sm" variant="primary">Process</Button>
              </div>
            ))}
            {pendingInvoices === 0 && (
              <p className="text-gray-500 text-center py-4">No pending invoices</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget & Lien Management */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Budget & Lien Management</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{casesWithLiens}</div>
              <div className="text-sm text-red-600">Cases with Liens</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{highValueCases}</div>
              <div className="text-sm text-blue-600">High-Value Cases</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">$2.3M</div>
              <div className="text-sm text-green-600">Total Liens</div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="primary">Generate Report</Button>
            <Button variant="secondary">Lien Management</Button>
            <Button variant="secondary">Budget Overview</Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}