'use client';

import { Case } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getStageColor } from '../../utils/helpers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CasesByStageSummaryProps {
  cases: Case[];
}

export function CasesByStageSummary({ cases }: CasesByStageSummaryProps) {
  const router = useRouter();
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());

  // Group cases by stage
  const casesByStage = cases.reduce((acc, caseItem) => {
    const stage = caseItem.stage;
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(caseItem);
    return acc;
  }, {} as Record<string, Case[]>);

  // Define stage order for consistent display
  const stageOrder = [
    'intake',
    'opening',
    'treating',
    'demandPrep',
    'negotiation',
    'settlement',
    'resolution',
    'probate',
    'closed'
  ];

  // Sort stages according to the defined order
  const sortedStages = stageOrder.filter(stage => casesByStage[stage]);

  const toggleStageExpansion = (stage: string) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stage)) {
      newExpanded.delete(stage);
    } else {
      newExpanded.add(stage);
    }
    setExpandedStages(newExpanded);
  };

  const getStageDisplayName = (stage: string): string => {
    const stageNames: Record<string, string> = {
      intake: 'Intake',
      opening: 'Opening',
      treating: 'Treating',
      demandPrep: 'Demand Prep',
      negotiation: 'Negotiation',
      settlement: 'Settlement',
      resolution: 'Resolution',
      probate: 'Probate',
      closed: 'Closed'
    };
    return stageNames[stage] || stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  const getStageMetrics = (stageCases: Case[]) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const recentCases = stageCases.filter(c => new Date(c.createdAt || c.dateOfLoss) > thirtyDaysAgo);
    const urgentCases = stageCases.filter(c => {
      if (!c.statuteOfLimitations) return false;
      const solDate = new Date(c.statuteOfLimitations.solDate);
      return solDate <= ninetyDaysFromNow && solDate >= now;
    });

    const avgAge = stageCases.length > 0
      ? Math.round(stageCases.reduce((sum, c) => {
          const age = (now.getTime() - new Date(c.dateOfLoss).getTime()) / (1000 * 60 * 60 * 24);
          return sum + age;
        }, 0) / stageCases.length)
      : 0;

    return {
      total: stageCases.length,
      recent: recentCases.length,
      urgent: urgentCases.length,
      avgAge
    };
  };

  const handleViewAll = (stage: string) => {
    router.push(`/cases?stage=${stage}`);
  };

  const handleViewUrgent = (stage: string) => {
    router.push(`/cases?stage=${stage}&filter=urgent`);
  };

  const handleViewRecent = (stage: string) => {
    router.push(`/cases?stage=${stage}&filter=recent`);
  };

  if (cases.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Cases by Stage</h2>
        <Badge variant="default" className="text-sm">
          {cases.length} Total Cases
        </Badge>
      </div>

      <div className="space-y-4">
        {sortedStages.map((stage) => {
          const stageCases = casesByStage[stage];
          const metrics = getStageMetrics(stageCases);
          const isExpanded = expandedStages.has(stage);
          const stageColor = getStageColor(stage);

          return (
            <Card key={stage} className="overflow-hidden">
              {/* Stage Header - Make entire card clickable */}
              <div
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleStageExpansion(stage)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500 text-lg">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {getStageDisplayName(stage)}
                      </h3>
                      <Badge className={stageColor}>
                        {metrics.total} cases
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {metrics.urgent > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className="text-red-500">⚠️</span>
                          <span>{metrics.urgent} urgent</span>
                        </div>
                      )}
                      {metrics.recent > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className="text-blue-500">🕒</span>
                          <span>{metrics.recent} recent</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metrics Column */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-blue-600 text-lg">📊</span>
                        <h4 className="font-medium text-gray-900">Metrics</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Age:</span>
                          <span className="font-medium">{metrics.avgAge} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Cases:</span>
                          <span className="font-medium">{metrics.total}</span>
                        </div>
                        {stageCases.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Oldest:</span>
                            <span className="font-medium text-xs">
                              {Math.max(...stageCases.map(c =>
                                Math.floor((new Date().getTime() - new Date(c.dateOfLoss).getTime()) / (1000 * 60 * 60 * 24))
                              ))} days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Urgent Cases Column */}
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-red-600 text-lg">⚠️</span>
                        <h4 className="font-medium text-gray-900">Urgent Cases</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-red-600">{metrics.urgent}</div>
                        <p className="text-sm text-gray-600">approaching SOL</p>
                        {metrics.urgent > 0 && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full mt-2"
                            onClick={() => handleViewUrgent(stage)}
                          >
                            View Urgent
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Recent Cases Column */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-blue-600 text-lg">🕒</span>
                        <h4 className="font-medium text-gray-900">Recent Cases</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-blue-600">{metrics.recent}</div>
                        <p className="text-sm text-gray-600">added this month</p>
                        {metrics.recent > 0 && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full mt-2"
                            onClick={() => handleViewRecent(stage)}
                          >
                            View Recent
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-green-600 text-lg">👁️</span>
                        <h4 className="font-medium text-gray-900">Actions</h4>
                      </div>
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="primary"
                          className="w-full"
                          onClick={() => handleViewAll(stage)}
                        >
                          View All Cases
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full"
                          onClick={() => router.push(`/cases?stage=${stage}&export=true`)}
                        >
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}