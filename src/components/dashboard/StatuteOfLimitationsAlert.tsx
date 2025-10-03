'use client';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useRouter } from 'next/navigation';

interface StatuteOfLimitationsAlertProps {
  title?: string;
  showCount?: boolean;
}

export function StatuteOfLimitationsAlert({
  title = "Cases Within 6 Months of SOL",
  showCount = true
}: StatuteOfLimitationsAlertProps) {
  const { cases } = useCases();
  const router = useRouter();

  // Filter cases within 6 months (180 days) of SOL
  const solCases = cases.filter(caseItem => {
    if (!caseItem.statuteOfLimitations?.solDate) return false;

    const solDate = new Date(caseItem.statuteOfLimitations.solDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setDate(sixMonthsFromNow.getDate() + 180);

    // Only show active cases (not closed)
    return solDate <= sixMonthsFromNow && caseItem.stage !== 'closed';
  });

  // Sort by SOL date (closest first)
  const sortedCases = solCases.sort((a, b) => {
    const aDate = new Date(a.statuteOfLimitations!.solDate);
    const bDate = new Date(b.statuteOfLimitations!.solDate);
    return aDate.getTime() - bDate.getTime();
  });

  const handleCaseClick = (caseId: string) => {
    router.push(`/cases/${caseId}`);
  };

  const getDaysUntilSOL = (solDate: string) => {
    const today = new Date();
    const sol = new Date(solDate);
    const diffTime = sol.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysUntilSOL: number) => {
    if (daysUntilSOL <= 30) return 'bg-red-50 border-red-200';
    if (daysUntilSOL <= 90) return 'bg-orange-50 border-orange-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  const getUrgencyBadge = (daysUntilSOL: number) => {
    if (daysUntilSOL <= 30) return { variant: 'danger' as const, text: 'Critical' };
    if (daysUntilSOL <= 90) return { variant: 'warning' as const, text: 'Urgent' };
    return { variant: 'default' as const, text: 'Warning' };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {showCount && (
            <Badge variant={solCases.length > 0 ? "danger" : "success"}>
              {solCases.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sortedCases.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-4xl mb-2">✓</div>
            <p className="text-gray-600">No cases within 6 months of SOL</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCases.slice(0, 5).map(caseItem => {
              const daysUntilSOL = getDaysUntilSOL(caseItem.statuteOfLimitations!.solDate);
              const urgency = getUrgencyBadge(daysUntilSOL);

              return (
                <div
                  key={caseItem._id}
                  className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getUrgencyColor(daysUntilSOL)}`}
                  onClick={() => handleCaseClick(caseItem._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{caseItem.title}</h4>
                        <Badge variant={urgency.variant} className="text-xs">
                          {urgency.text}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {caseItem.clientId?.name} • Case #{caseItem.caseNumber}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          SOL: {new Date(caseItem.statuteOfLimitations!.solDate).toLocaleDateString()}
                        </span>
                        <span className={`font-medium ${
                          daysUntilSOL <= 30 ? 'text-red-600' :
                          daysUntilSOL <= 90 ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {daysUntilSOL > 0 ? `${daysUntilSOL} days left` : `${Math.abs(daysUntilSOL)} days past due`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="text-xs" variant="default">
                          {caseItem.stage}
                        </Badge>
                        {caseItem.assignedAttorney && (
                          <span className="text-xs text-gray-500">
                            Attorney: {caseItem.assignedAttorney.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" className="ml-4">
                      View Case
                    </Button>
                  </div>
                </div>
              );
            })}

            {sortedCases.length > 5 && (
              <div className="text-center pt-4">
                <Button variant="secondary" size="sm">
                  View All {sortedCases.length} Cases
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}