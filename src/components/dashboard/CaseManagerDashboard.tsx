'use client';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useUser } from '../../contexts/UserContext';
import { CaseSearch } from './CaseSearch';
import { Case } from '../../types';

export function CaseManagerDashboard() {
  const { cases } = useCases();
  const { isCaseManager } = useUser();

  // Calculate case manager metrics
  const activeCases = cases.filter(c => c.stage !== 'closed' && c.stage !== 'intake').length;
  const urgentDeadlines = cases.filter(c => {
    if (!c.statuteOfLimitations) return false;
    const solDate = new Date(c.statuteOfLimitations.solDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return solDate <= thirtyDaysFromNow && c.stage !== 'closed';
  }).length;

  const handleCaseSelect = (caseItem: Case) => {
    // Navigate to case details or open case modal
    console.log('Selected case:', caseItem);
    // You can implement navigation to case details here
  };

  if (!isCaseManager) return null;

  return (
    <div className="space-y-6">
      <CaseSearch
        cases={cases}
        onCaseSelect={handleCaseSelect}
        placeholder="Search cases by case number or client name..."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Cases */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Active Cases</h3>
            <Badge variant="success">{activeCases}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cases.filter(c => c.stage !== 'closed' && c.stage !== 'intake').slice(0, 3).map(caseItem => (
              <div key={caseItem._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-sm text-gray-600">Stage: {caseItem.stage}</p>
                </div>
                <Button size="sm" variant="secondary">View</Button>
              </div>
            ))}
            {activeCases === 0 && (
              <p className="text-gray-500 text-center py-4">No active cases</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Urgent Deadlines */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Urgent Deadlines (30 days)</h3>
            <Badge variant="danger">{urgentDeadlines}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cases.filter(c => {
              if (!c.statuteOfLimitations) return false;
              const solDate = new Date(c.statuteOfLimitations.solDate);
              const thirtyDaysFromNow = new Date();
              thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
              return solDate <= thirtyDaysFromNow && c.stage !== 'closed';
            }).slice(0, 3).map(caseItem => (
              <div key={caseItem._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-sm text-gray-600">
                    SOL: {new Date(caseItem.statuteOfLimitations!.solDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="danger">Urgent</Badge>
              </div>
            ))}
            {urgentDeadlines === 0 && (
              <p className="text-gray-500 text-center py-4">No urgent deadlines</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Tasks & Workflow */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Team Workflow</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {cases.filter(c => c.stage === 'treating').length}
              </div>
              <div className="text-sm text-blue-600">Treating</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {cases.filter(c => c.stage === 'demandPrep').length}
              </div>
              <div className="text-sm text-yellow-600">Demand Prep</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {cases.filter(c => c.stage === 'negotiation').length}
              </div>
              <div className="text-sm text-orange-600">Negotiation</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {cases.filter(c => c.stage === 'settlement').length}
              </div>
              <div className="text-sm text-green-600">Settlement</div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="primary">Assign Cases</Button>
            <Button variant="secondary">Team Overview</Button>
            <Button variant="secondary">Workflow Settings</Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}