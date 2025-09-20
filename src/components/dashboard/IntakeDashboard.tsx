'use client';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useUser } from '../../contexts/UserContext';
import { CaseSearch } from './CaseSearch';
import { Case } from '../../types';

export function IntakeDashboard() {
  const { cases } = useCases();
  const { isIntake } = useUser();

  // Filter cases to only show those in intake stage for intake users
  const intakeCases = cases.filter(c => c.stage === 'intake');

  // Calculate intake-specific metrics
  const newIntakes = intakeCases.filter(c => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(c.createdAt || c.dateOfLoss) > sevenDaysAgo;
  }).length;

  const pendingReviews = intakeCases.length;
  const urgentIntakes = intakeCases.filter(c => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(c.createdAt || c.dateOfLoss) < threeDaysAgo;
  }).length;

  const handleCaseSelect = (caseItem: Case) => {
    // Navigate to case details or open case modal
    console.log('Selected case:', caseItem);
    // You can implement navigation to case details here
  };

  if (!isIntake) return null;

  return (
    <div className="space-y-6">
      <CaseSearch
        cases={intakeCases}
        onCaseSelect={handleCaseSelect}
        placeholder="Search intake cases by case number or client name..."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* New Intakes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">New Intakes (7 days)</h3>
            <Badge variant="success">{newIntakes}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {intakeCases.filter(c => {
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
              return new Date(c.createdAt || c.dateOfLoss) > sevenDaysAgo;
            }).slice(0, 3).map(caseItem => (
              <div key={caseItem._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-sm text-gray-600">{caseItem.clientId.name}</p>
                </div>
                <Badge variant="success">New</Badge>
              </div>
            ))}
            {newIntakes === 0 && (
              <p className="text-gray-500 text-center py-4">No new intakes this week</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pending Reviews</h3>
            <Badge variant="warning">{pendingReviews}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {intakeCases.slice(0, 3).map(caseItem => (
              <div key={caseItem._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-sm text-gray-600">{caseItem.clientId.name}</p>
                </div>
                <Button size="sm" variant="primary">Review</Button>
              </div>
            ))}
            {pendingReviews === 0 && (
              <p className="text-gray-500 text-center py-4">No cases pending review</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Case Queue & Actions */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Intake Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{urgentIntakes}</div>
              <div className="text-sm text-blue-600">Urgent Reviews (&gt;3 days)</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{pendingReviews}</div>
              <div className="text-sm text-green-600">Total Pending</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{newIntakes}</div>
              <div className="text-sm text-purple-600">This Week</div>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <Button variant="primary">New Case Intake</Button>
            <Button variant="secondary">Review Queue</Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}