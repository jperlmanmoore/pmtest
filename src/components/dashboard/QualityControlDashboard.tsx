'use client';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useUser } from '../../contexts/UserContext';
import { CaseSearch } from './CaseSearch';
import { StatuteOfLimitationsAlert } from './StatuteOfLimitationsAlert';
import { AnteLitemAlert } from './AnteLitemAlert';
import { Case } from '../../types';
import { useState, useMemo } from 'react';

export function QualityControlDashboard() {
  const { cases } = useCases();
  const { isQualityControl } = useUser();
  const [selectedAttorney, setSelectedAttorney] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'cases' | 'quality'>('name');

  // Get all attorneys from cases
  const attorneys = useMemo(() => {
    const attorneyMap = new Map<string, { id: string; name: string; cases: Case[] }>();

    cases.forEach(caseItem => {
      if (caseItem.assignedAttorney) {
        const attorneyId = caseItem.assignedAttorney._id;
        const attorneyName = caseItem.assignedAttorney.name;

        if (!attorneyMap.has(attorneyId)) {
          attorneyMap.set(attorneyId, {
            id: attorneyId,
            name: attorneyName,
            cases: []
          });
        }
        attorneyMap.get(attorneyId)!.cases.push(caseItem);
      }
    });

    return Array.from(attorneyMap.values());
  }, [cases]);

  // Filter cases based on selected attorney
  const filteredCases = useMemo(() => {
    if (selectedAttorney === 'all') return cases;
    return cases.filter(c => c.assignedAttorney?._id === selectedAttorney);
  }, [cases, selectedAttorney]);

  // Sort attorneys based on selected criteria
  const sortedAttorneys = useMemo(() => {
    return [...attorneys].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cases':
          return b.cases.length - a.cases.length;
        case 'quality':
          // Calculate quality score based on compliance issues
          const getQualityScore = (attorneyCases: Case[]) => {
            const complianceIssues = attorneyCases.filter(c => {
              const hasMissingInfo = !c.description || !c.dateOfLoss || (c.anteLitemRequired && !c.anteLitemAgency);
              return hasMissingInfo && c.stage !== 'closed';
            }).length;
            return attorneyCases.length > 0 ? (attorneyCases.length - complianceIssues) / attorneyCases.length : 1;
          };
          return getQualityScore(b.cases) - getQualityScore(a.cases);
        default:
          return 0;
      }
    });
  }, [attorneys, sortBy]);

  // Calculate QC-specific metrics for filtered cases (remove stage filtering)
  const casesNeedingReview = filteredCases.filter(c => {
    // Check for cases needing review based on quality criteria, not stage
    const hasMissingInfo = !c.description || !c.dateOfLoss || (c.anteLitemRequired && !c.anteLitemAgency);
    const isOverdue = c.createdAt && new Date(c.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return (hasMissingInfo || isOverdue) && c.stage !== 'closed';
  }).length;

  const urgentReviews = filteredCases.filter(c => {
    // Check for urgent cases based on SOL dates only (remove stage filtering)
    if (!c.statuteOfLimitations) return false;
    const solDate = new Date(c.statuteOfLimitations.solDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return solDate <= thirtyDaysFromNow && c.stage !== 'closed';
  }).length;

  const complianceIssues = filteredCases.filter(c => {
    // Check for missing required information
    const hasMissingInfo = !c.description || !c.dateOfLoss || (c.anteLitemRequired && !c.anteLitemAgency);
    return hasMissingInfo && c.stage !== 'closed';
  }).length;

  const qualityScore = Math.round((filteredCases.length - complianceIssues) / filteredCases.length * 100) || 100;

  const overdueReviews = filteredCases.filter(c => {
    // Check for overdue cases based on creation date only (remove stage filtering)
    const createdDate = new Date(c.createdAt || c.dateOfLoss);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdDate < sevenDaysAgo && c.stage !== 'closed';
  }).length;

  const handleCaseSelect = (caseItem: Case) => {
    // Navigate to case details or open case modal
    console.log('Selected case:', caseItem);
    // You can implement navigation to case details here
  };

  const handleAttorneySelect = (attorneyId: string) => {
    setSelectedAttorney(attorneyId);
  };

  const getAttorneyQualityScore = (attorneyCases: Case[]) => {
    const complianceIssues = attorneyCases.filter(c => {
      const hasMissingInfo = !c.description || !c.dateOfLoss || (c.anteLitemRequired && !c.anteLitemAgency);
      return hasMissingInfo && c.stage !== 'closed';
    }).length;
    return attorneyCases.length > 0 ? Math.round((attorneyCases.length - complianceIssues) / attorneyCases.length * 100) : 100;
  };

  if (!isQualityControl) return null;

  return (
    <div className="space-y-6">
      {/* Statute of Limitations Alert */}
      <StatuteOfLimitationsAlert title="Cases Within 6 Months of SOL" />

      {/* Ante Litem Alert */}
      <AnteLitemAlert title="Cases Requiring Ante Litem Notice" />

      {/* Attorney Filter and Sort Controls */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Attorney Quality Review</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Attorney</label>
              <select
                value={selectedAttorney}
                onChange={(e) => handleAttorneySelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Select attorney to filter cases"
              >
                <option value="all">All Attorneys</option>
                {attorneys.map(attorney => (
                  <option key={attorney.id} value={attorney.id}>
                    {attorney.name} ({attorney.cases.length} cases)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Attorneys By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'cases' | 'quality')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Select sorting criteria for attorneys"
              >
                <option value="name">Name (A-Z)</option>
                <option value="cases">Case Count</option>
                <option value="quality">Quality Score</option>
              </select>
            </div>
          </div>

          {/* Attorney Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAttorneys.map(attorney => {
              const qualityScore = getAttorneyQualityScore(attorney.cases);
              const urgentCases = attorney.cases.filter(c => {
                if (!c.statuteOfLimitations) return false;
                const solDate = new Date(c.statuteOfLimitations.solDate);
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                return solDate <= thirtyDaysFromNow;
              }).length;

              return (
                <div
                  key={attorney.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedAttorney === attorney.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAttorneySelect(attorney.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{attorney.name}</h4>
                    <Badge variant={qualityScore >= 90 ? "success" : qualityScore >= 75 ? "warning" : "danger"}>
                      {qualityScore}%
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Cases:</span>
                      <span className="font-medium">{attorney.cases.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Urgent:</span>
                      <span className="font-medium text-red-600">{urgentCases}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <CaseSearch
        cases={filteredCases}
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
              <span>Urgent Cases (SOL)</span>
              <Badge variant="danger">{urgentReviews}</Badge>
            </div>
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
            {filteredCases.filter(c => {
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
                    {caseItem.assignedAttorney && (
                      <span className="ml-2 text-blue-600">• {caseItem.assignedAttorney.name}</span>
                    )}
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
              <div className="text-sm text-blue-600">
                {selectedAttorney === 'all' ? 'Cases Needing Review' : 'Attorney Cases'}
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{urgentReviews}</div>
              <div className="text-sm text-red-600">
                Urgent Cases (SOL)
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{overdueReviews}</div>
              <div className="text-sm text-yellow-600">Overdue Reviews</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{qualityScore}%</div>
              <div className="text-sm text-green-600">
                {selectedAttorney === 'all' ? 'Quality Score' : 'Attorney Score'}
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="primary">Run Quality Audit</Button>
            <Button variant="secondary">Review Guidelines</Button>
            <Button variant="secondary">Compliance Reports</Button>
            <Button variant="secondary">Training Materials</Button>
            {selectedAttorney !== 'all' && (
              <>
                <Button variant="secondary">Attorney Performance</Button>
                <Button variant="secondary">Case Assignment Review</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}