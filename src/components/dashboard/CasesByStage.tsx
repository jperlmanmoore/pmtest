'use client';

import { Case } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { getStageColor, formatDate } from '../../utils/helpers';
import { useRouter } from 'next/navigation';

interface CasesByStageProps {
  cases: Case[];
}

export function CasesByStage({ cases }: CasesByStageProps) {
  const router = useRouter();

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

  const handleCaseClick = (caseId: string) => {
    router.push(`/cases/${caseId}`);
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

  if (cases.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Cases by Stage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStages.map((stage) => {
          const stageCases = casesByStage[stage];
          const stageColor = getStageColor(stage);

          return (
            <Card key={stage} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {getStageDisplayName(stage)}
                  </h3>
                  <Badge className={stageColor}>
                    {stageCases.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {stageCases.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No cases in this stage</p>
                ) : (
                  <div className="space-y-3">
                    {stageCases.slice(0, 5).map((caseItem) => (
                      <div
                        key={caseItem._id}
                        className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleCaseClick(caseItem._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {caseItem.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {caseItem.clientId.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(caseItem.dateOfLoss)}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span className="text-xs text-gray-500">
                              #{caseItem.caseNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {stageCases.length > 5 && (
                      <p className="text-xs text-gray-500 text-center pt-2">
                        +{stageCases.length - 5} more cases
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}