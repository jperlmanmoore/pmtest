'use client';

import { useMemo, memo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useCases } from '../../hooks/useCases';
import { useRouter } from 'next/navigation';
import { Case } from '../../types';

interface AnteLitemAlertProps {
  title?: string;
  showCount?: boolean;
}

export const AnteLitemAlert = memo(function AnteLitemAlert({ title = "Cases Requiring Ante Litem Notice", showCount = true }: AnteLitemAlertProps) {
  const { cases } = useCases();
  const router = useRouter();

  const getCaseType = useMemo(() => (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('car accident')) return 'Car Accident';
    if (lowerTitle.includes('slip and fall')) return 'Slip and Fall';
    if (lowerTitle.includes('apartment')) return 'Apartment';
    if (lowerTitle.includes('sexual assault')) return 'Sexual Assault';
    if (lowerTitle.includes('dog bite')) return 'Dog Bite';
    return 'Other';
  }, []);

  const getCaseSummary = useMemo(() => (caseItem: Case): string => {
    const caseType = getCaseType(caseItem.title);
    const isPremisesCase = caseType === 'Slip and Fall' || caseType === 'Apartment';
    
    // Get injury description from description or medical providers
    let injuryDescription = '';
    if (caseItem.description) {
      // Extract key injury information from description
      const desc = caseItem.description.toLowerCase();
      if (desc.includes('fracture') || desc.includes('broken')) injuryDescription = 'Fractures';
      else if (desc.includes('concussion') || desc.includes('head injury')) injuryDescription = 'Head Injury';
      else if (desc.includes('back') || desc.includes('spine')) injuryDescription = 'Back/Spinal';
      else if (desc.includes('neck')) injuryDescription = 'Neck Injury';
      else if (desc.includes('shoulder')) injuryDescription = 'Shoulder Injury';
      else if (desc.includes('knee')) injuryDescription = 'Knee Injury';
      else if (desc.includes('wrist') || desc.includes('ankle')) injuryDescription = 'Extremity Injury';
      else if (desc.includes('burn')) injuryDescription = 'Burns';
      else if (desc.includes('laceration') || desc.includes('cut')) injuryDescription = 'Lacerations';
      else injuryDescription = 'Personal Injury';
    } else if (caseItem.medicalProviders && caseItem.medicalProviders.length > 0) {
      // Use medical provider specialties as injury indicators
      const specialties = caseItem.medicalProviders.map(p => p.specialty).filter(Boolean);
      if (specialties.includes('Orthopedic Surgery') || specialties.includes('Orthopedics')) injuryDescription = 'Orthopedic';
      else if (specialties.includes('Neurology') || specialties.includes('Neurosurgery')) injuryDescription = 'Neurological';
      else if (specialties.includes('Emergency Medicine')) injuryDescription = 'Emergency Care';
      else injuryDescription = 'Medical Treatment';
    } else {
      injuryDescription = 'Personal Injury';
    }
    
    // Build summary
    let summary = `${caseType} - ${injuryDescription}`;
    
    // Add location for premises cases
    if (isPremisesCase && caseItem.placeOfIncident) {
      summary += ` at ${caseItem.placeOfIncident}`;
    }
    
    return summary;
  }, [getCaseType]);

  // Memoized calculations for performance
  const sortedCases = useMemo(() => {
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
    return urgentAnteLitemCases.sort((a, b) => {
      const dateA = new Date(a.anteLitemDeadline!);
      const dateB = new Date(b.anteLitemDeadline!);
      return dateA.getTime() - dateB.getTime();
    });
  }, [cases]);

  const getDaysUntilDeadline = useMemo(() => (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const handleCaseClick = useMemo(() => (caseItem: Case) => {
    router.push(`/cases/${caseItem._id}`);
  }, [router]);

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
          {sortedCases.map(caseItem => {
            const daysUntil = getDaysUntilDeadline(caseItem.anteLitemDeadline!);

            return (
              <div
                key={caseItem._id}
                className="p-4 rounded-md bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors border border-orange-200"
                onClick={() => handleCaseClick(caseItem)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">{caseItem.clientId?.name || 'Unknown Client'}</div>
                    <div className="text-xs text-gray-600 mb-1">{caseItem.title}</div>
                    <div className="text-xs text-gray-500 mb-2">{getCaseSummary(caseItem)}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>📅 Loss: {new Date(caseItem.dateOfLoss).toLocaleDateString()}</span>
                      <span>⚖️ Due: {new Date(caseItem.anteLitemDeadline!).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      daysUntil <= 0 
                        ? 'bg-red-100 text-red-800' 
                        : daysUntil <= 7 
                          ? 'bg-red-100 text-red-800'
                          : daysUntil <= 30 
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {daysUntil <= 0 ? 'Overdue' : `${daysUntil} days`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});