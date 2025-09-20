'use client';

import { Case } from '../../types';
import { Badge } from '../ui/Badge';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { formatDate, getStageColor } from '../../utils/helpers';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

interface CasesTableProps {
  cases: Case[];
}

type SortField = 'dateOfLoss' | 'clientName' | 'caseType' | 'statuteOfLimitations' | 'stage';
type SortOrder = 'asc' | 'desc';

export function CasesTable({ cases }: CasesTableProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortField>('dateOfLoss');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleRowClick = (caseId: string) => {
    router.push(`/cases/${caseId}`);
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getCaseType = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('car accident')) return 'Car Accident';
    if (lowerTitle.includes('slip and fall')) return 'Slip and Fall';
    if (lowerTitle.includes('apartment')) return 'Apartment';
    if (lowerTitle.includes('sexual assault')) return 'Sexual Assault';
    if (lowerTitle.includes('dog bite')) return 'Dog Bite';
    return 'Other';
  };

  const getSOLStatus = (sol?: { solDate: string; solStatus: string }) => {
    if (!sol) return { text: '-', color: 'text-gray-500' };
    
    const solDate = new Date(sol.solDate);
    const today = new Date();
    const daysUntilSOL = Math.ceil((solDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (sol.solStatus === 'expired' || daysUntilSOL < 0) {
      return { text: formatDate(sol.solDate), color: 'text-red-600 font-bold' };
    } else if (daysUntilSOL <= 91) { // 3 months
      return { text: formatDate(sol.solDate), color: 'text-red-600 font-bold' };
    } else if (daysUntilSOL <= 183) { // 6 months
      return { text: formatDate(sol.solDate), color: 'text-pink-600 font-semibold' };
    } else if (daysUntilSOL <= 274) { // 9 months
      return { text: formatDate(sol.solDate), color: 'text-orange-600 font-semibold' };
    } else if (daysUntilSOL <= 365) { // 1 year
      return { text: formatDate(sol.solDate), color: 'text-yellow-600 font-semibold' };
    } else {
      return { text: formatDate(sol.solDate), color: 'text-green-600' };
    }
  };

  const sortedCases = useMemo(() => {
    return [...cases].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'dateOfLoss':
          aValue = new Date(a.dateOfLoss).getTime();
          bValue = new Date(b.dateOfLoss).getTime();
          break;
        case 'clientName':
          aValue = a.clientId.name.toLowerCase();
          bValue = b.clientId.name.toLowerCase();
          break;
        case 'caseType':
          aValue = getCaseType(a.title);
          bValue = getCaseType(b.title);
          break;
        case 'statuteOfLimitations':
          aValue = a.statuteOfLimitations ? new Date(a.statuteOfLimitations.solDate).getTime() : 0;
          bValue = b.statuteOfLimitations ? new Date(b.statuteOfLimitations.solDate).getTime() : 0;
          break;
        case 'stage':
          aValue = a.stage.toLowerCase();
          bValue = b.stage.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [cases, sortBy, sortOrder]);

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <span className="text-gray-400">
          {sortBy === field ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </div>
    </th>
  );

  if (cases.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-gray-400 text-lg mb-2">No cases found</div>
          <p className="text-gray-500">Get started by adding your first case.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">All Cases</h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader field="clientName">
                  Client
                </SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Number
                </th>
                <SortableHeader field="caseType">
                  Case Type
                </SortableHeader>
                <SortableHeader field="stage">
                  Stage
                </SortableHeader>
                <SortableHeader field="statuteOfLimitations">
                  SOL Date
                </SortableHeader>
                <SortableHeader field="dateOfLoss">
                  Date of Loss
                </SortableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCases.map((caseItem) => {
                return (
                  <tr
                    key={caseItem._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(caseItem._id)}
                  >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {caseItem.clientId.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {caseItem.caseNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="default" className="text-xs">
                      {getCaseType(caseItem.title)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStageColor(caseItem.stage)}>
                      {caseItem.stage}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getSOLStatus(caseItem.statuteOfLimitations).color}>
                      {getSOLStatus(caseItem.statuteOfLimitations).text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(caseItem.dateOfLoss)}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}