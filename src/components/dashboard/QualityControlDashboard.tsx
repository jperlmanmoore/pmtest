'use client';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useUser } from '../../contexts/UserContext';
import { CaseSearch } from './CaseSearch';
import { Case } from '../../types';

export function QualityControlDashboard() {
  const { cases } = useCases();
  const { isQualityControl } = useUser();

  // Calculate QC-specific metrics
  const casesNeedingReview = cases.filter(c =>
    c.stage === 'demandPrep' || c.stage === 'negotiation' || c.stage === 'settlement'
  ).length;

  const urgentReviews = cases.filter(c => {
    if (!c.statuteOfLimitations) return false;
    const solDate = new Date(c.statuteOfLimitations.solDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return solDate <= thirtyDaysFromNow && (c.stage === 'demandPrep' || c.stage === 'negotiation');
  }).length;

  const complianceIssues = cases.filter(c => {
    // Check for missing required information
    const hasMissingInfo = !c.description || !c.dateOfLoss || (c.anteLitemRequired && !c.anteLitemAgency);
    return hasMissingInfo && c.stage !== 'closed';
  }).length;

  const qualityScore = Math.round((cases.length - complianceIssues) / cases.length * 100) || 100;

  const overdueReviews = cases.filter(c => {
    const createdDate = new Date(c.createdAt || c.dateOfLoss);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return c.stage === 'intake' && createdDate < sevenDaysAgo;
  }).length;

  const handleCaseSelect = (caseItem: Case) => {
    // Navigate to case details or open case modal
    console.log('Selected case:', caseItem);
    // You can implement navigation to case details here
  };

  if (!isQualityControl) return null;

  return (
    <div className="space-y-6">
      <CaseSearch
        cases={cases}
        onCaseSelect={handleCaseSelect}
        placeholder="Search cases for quality review..."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Quality Metrics</h3>
            <Badge variant={qualityScore >= 90 ? "success" : qualityScore >= 75 ? "warning" : "danger"}>
              {qualityScore}% Score
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Compliance Issues</span>
              <Badge variant="danger">{complianceIssues}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Overdue Reviews</span>
              <Badge variant="warning">{overdueReviews}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Cases Needing Review</span>
              <Badge variant="default">{casesNeedingReview}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Urgent Reviews</span>
              <Badge variant="danger">{urgentReviews}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Needing Review */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Cases Needing Review</h3>
            <Badge variant="warning">{casesNeedingReview}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cases.filter(c =>
              c.stage === 'demandPrep' || c.stage === 'negotiation' || c.stage === 'settlement'
            ).slice(0, 3).map(caseItem => (
              <div key={caseItem._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-sm text-gray-600">{caseItem.clientId.name} - {caseItem.stage}</p>
                </div>
                <Button size="sm" variant="primary">Review</Button>
              </div>
            ))}
            {casesNeedingReview === 0 && (
              <p className="text-gray-500 text-center py-4">No cases pending quality review</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Issues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Issues</h3>
            <Badge variant="danger">{complianceIssues}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cases.filter(c => {
              const hasMissingInfo = !c.description || !c.dateOfLoss || (c.anteLitemRequired && !c.anteLitemAgency);
              return hasMissingInfo && c.stage !== 'closed';
            }).slice(0, 3).map(caseItem => (
              <div key={caseItem._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-sm text-gray-600">
                    Missing: {!caseItem.description && 'Description, '}
                    {!caseItem.dateOfLoss && 'Date of Loss, '}
                    {(caseItem.anteLitemRequired && !caseItem.anteLitemAgency) && 'Ante Litem Agency'}
                  </p>
                </div>
                <Button size="sm" variant="danger">Fix Issue</Button>
              </div>
            ))}
            {complianceIssues === 0 && (
              <p className="text-gray-500 text-center py-4">No compliance issues found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quality Control Actions */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Quality Control Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{casesNeedingReview}</div>
              <div className="text-sm text-blue-600">Pending Reviews</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{complianceIssues}</div>
              <div className="text-sm text-red-600">Compliance Issues</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{overdueReviews}</div>
              <div className="text-sm text-yellow-600">Overdue Reviews</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{qualityScore}%</div>
              <div className="text-sm text-green-600">Quality Score</div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="primary">Run Quality Audit</Button>
            <Button variant="secondary">Review Guidelines</Button>
            <Button variant="secondary">Compliance Reports</Button>
            <Button variant="secondary">Training Materials</Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}