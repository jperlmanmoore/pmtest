'use client';

import { useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCases } from '../../hooks/useCases';
import { Case } from '../../types';

export const StatuteOfLimitationsAlert = memo(function StatuteOfLimitationsAlert() {
  const router = useRouter();
  const { cases } = useCases();

  const getCaseType = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('car accident')) return 'Car Accident';
    if (lowerTitle.includes('slip and fall')) return 'Slip and Fall';
    if (lowerTitle.includes('apartment')) return 'Apartment';
    if (lowerTitle.includes('sexual assault')) return 'Sexual Assault';
    if (lowerTitle.includes('dog bite')) return 'Dog Bite';
    return 'Other';
  };

  const getCaseSummary = (caseItem: Case): string => {
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
  };

  const solCases = useMemo(() => {
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    return cases
      .filter(c => {
        if (c.stage === 'closed') return false;
        if (!c.statuteOfLimitations) return false;

        const solDate = new Date(c.statuteOfLimitations.solDate);
        return solDate <= sixMonthsFromNow && solDate >= today;
      })
      .map(c => {
        const solDate = new Date(c.statuteOfLimitations!.solDate);
        const daysRemaining = Math.ceil((solDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return {
          ...c,
          daysRemaining,
          solDate,
          urgency: daysRemaining <= 30 ? 'urgent' : daysRemaining <= 90 ? 'warning' : 'monitor'
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [cases]);

  // Group cases by timeframe
  const groupedCases = useMemo(() => {
    const groups = {
      thisMonth: solCases.filter(c => c.daysRemaining <= 30),
      nextTwoMonths: solCases.filter(c => c.daysRemaining > 30 && c.daysRemaining <= 90),
      nextThreeToSixMonths: solCases.filter(c => c.daysRemaining > 90 && c.daysRemaining <= 180)
    };
    return groups;
  }, [solCases]);

  if (solCases.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>⚖️</span>
          Cases Within 6 Months of SOL
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* This Month Section */}
          {groupedCases.thisMonth.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                📅 This Month (≤30 days)
                <Badge variant="danger" className="text-xs">
                  {groupedCases.thisMonth.length} case{groupedCases.thisMonth.length !== 1 ? 's' : ''}
                </Badge>
              </h4>
              <div className="space-y-1">
                {groupedCases.thisMonth.map(caseItem => (
                  <div
                    key={caseItem._id}
                    className="flex items-center justify-between p-2 rounded-md bg-red-50 hover:bg-red-100 cursor-pointer transition-colors"
                    onClick={() => router.push(`/cases/${caseItem._id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-red-800">🔴</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{caseItem.clientId?.name || 'Unknown Client'}</div>
                        <div className="text-xs text-gray-600">{caseItem.title}</div>
                        <div className="text-xs text-gray-500">{getCaseSummary(caseItem)}</div>
                      </div>
                    </div>
                    <span className="text-xs text-red-800 font-medium">
                      {caseItem.daysRemaining} days
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next 2 Months Section */}
          {groupedCases.nextTwoMonths.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                📅 Next 2 Months (31-90 days)
                <Badge variant="warning" className="text-xs bg-orange-100 text-orange-800">
                  {groupedCases.nextTwoMonths.length} case{groupedCases.nextTwoMonths.length !== 1 ? 's' : ''}
                </Badge>
              </h4>
              <div className="space-y-1">
                {groupedCases.nextTwoMonths.map(caseItem => (
                  <div
                    key={caseItem._id}
                    className="flex items-center justify-between p-2 rounded-md bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors"
                    onClick={() => router.push(`/cases/${caseItem._id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-orange-800">🟠</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{caseItem.clientId?.name || 'Unknown Client'}</div>
                        <div className="text-xs text-gray-600">{caseItem.title}</div>
                        <div className="text-xs text-gray-500">{getCaseSummary(caseItem)}</div>
                      </div>
                    </div>
                    <span className="text-xs text-orange-800 font-medium">
                      {caseItem.daysRemaining} days
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next 3-6 Months Section */}
          {groupedCases.nextThreeToSixMonths.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                📅 Next 3-6 Months (91-180 days)
                <Badge variant="default" className="text-xs border-yellow-300 text-yellow-700">
                  {groupedCases.nextThreeToSixMonths.length} case{groupedCases.nextThreeToSixMonths.length !== 1 ? 's' : ''}
                </Badge>
              </h4>
              <div className="space-y-1">
                {groupedCases.nextThreeToSixMonths.map(caseItem => (
                  <div
                    key={caseItem._id}
                    className="flex items-center justify-between p-2 rounded-md bg-yellow-50 hover:bg-yellow-100 cursor-pointer transition-colors"
                    onClick={() => router.push(`/cases/${caseItem._id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-800">🟡</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{caseItem.clientId?.name || 'Unknown Client'}</div>
                        <div className="text-xs text-gray-600">{caseItem.title}</div>
                        <div className="text-xs text-gray-500">{getCaseSummary(caseItem)}</div>
                      </div>
                    </div>
                    <span className="text-xs text-yellow-800 font-medium">
                      {caseItem.daysRemaining} days
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View All Button */}
          <div className="pt-2 border-t">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/overview?filter=sol')}
              className="w-full"
            >
              View All {solCases.length} Cases
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});