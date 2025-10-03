'use client';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { useRouter } from 'next/navigation';
import { Case } from '../../types';

interface AnteLitemAlertProps {
  title?: string;
  showCount?: boolean;
}

export function AnteLitemAlert({ title = "Cases Requiring Ante Litem Notice", showCount = true }: AnteLitemAlertProps) {
  const { cases } = useCases();
  const router = useRouter();

  // Filter cases that require ante litem and have deadlines
  const anteLitemCases = cases.filter(c =>
    c.anteLitemRequired &&
    c.anteLitemDeadline &&
    c.stage !== 'closed'
  );

  // Filter cases within 90 days of ante litem deadline
  const urgentAnteLitemCases = anteLitemCases.filter(caseItem => {
    const deadline = new Date(caseItem.anteLitemDeadline!);
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    return deadline <= ninetyDaysFromNow;
  });

  // Sort by deadline (closest first)
  const sortedCases = urgentAnteLitemCases.sort((a, b) => {
    const dateA = new Date(a.anteLitemDeadline!);
    const dateB = new Date(b.anteLitemDeadline!);
    return dateA.getTime() - dateB.getTime();
  });

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 30) return 'danger';
    if (days <= 60) return 'warning';
    return 'default';
  };

  const handleCaseClick = (caseItem: Case) => {
    router.push(`/cases/${caseItem._id}`);
  };

  if (sortedCases.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {showCount && <Badge variant="warning">{sortedCases.length}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedCases.slice(0, 5).map(caseItem => {
            const daysUntil = getDaysUntilDeadline(caseItem.anteLitemDeadline!);
            const urgencyColor = getUrgencyColor(daysUntil);

            return (
              <div
                key={caseItem._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleCaseClick(caseItem)}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{caseItem.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600">
                      Deadline: {new Date(caseItem.anteLitemDeadline!).toLocaleDateString()}
                    </p>
                    <Badge variant={urgencyColor}>
                      {daysUntil <= 0 ? 'Overdue' : `${daysUntil} days`}
                    </Badge>
                  </div>
                  {caseItem.anteLitemAgency && (
                    <p className="text-sm text-gray-500 mt-1">
                      Agency: {caseItem.anteLitemAgency}
                    </p>
                  )}
                </div>
                <Button size="sm" variant="secondary">View Case</Button>
              </div>
            );
          })}
          {sortedCases.length > 5 && (
            <div className="text-center pt-2">
              <Button variant="secondary" size="sm">
                View {sortedCases.length - 5} more cases...
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}