'use client';

import { Case } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { getStageColor, formatDate } from '../../utils/helpers';
import { useRouter } from 'next/navigation';
import { useTasks } from '../../hooks/useTasks';

interface CasesByStageProps {
  cases: Case[];
}

export function CasesByStage({ cases }: CasesByStageProps) {
  const router = useRouter();
  const { tasks: allTasks } = useTasks();

  // Group cases by stage
  const casesByStage = cases.reduce((acc, caseItem) => {
    const stage = caseItem.stage;
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(caseItem);
    return acc;
  }, {} as Record<string, Case[]>);

  const getTaskStats = (caseId: string) => {
    const caseTasks = allTasks.filter(task => task.caseId === caseId);
    const total = caseTasks.length;
    const completed = caseTasks.filter(t => t.status === 'completed').length;
    const inProgress = caseTasks.filter(t => t.status === 'in_progress').length;
    const overdue = caseTasks.filter(t =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== 'completed'
    ).length;

    return { total, completed, inProgress, overdue };
  };

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
                            {(() => {
                              const stats = getTaskStats(caseItem._id);
                              return stats.total > 0 ? (
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className="text-xs text-gray-600">{stats.total} tasks</span>
                                  {stats.completed > 0 && (
                                    <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0">
                                      {stats.completed}
                                    </Badge>
                                  )}
                                  {stats.overdue > 0 && (
                                    <Badge className="bg-red-100 text-red-800 text-xs px-1 py-0">
                                      {stats.overdue} overdue
                                    </Badge>
                                  )}
                                </div>
                              ) : null;
                            })()}
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