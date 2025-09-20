'use client';

import { Case } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { formatDate, getStageColor } from '../../utils/helpers';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useUser } from '../../contexts/UserContext';

interface CasesTableProps {
  cases: Case[];
  onEdit: (caseItem: Case) => void;
  onClose?: (id: string) => void;
  onRequestClose?: (caseId: string, reason: string) => void;
  onApproveClose?: (caseId: string) => void;
  onRejectClose?: (caseId: string) => void;
}

type SortField = 'dateOfLoss' | 'clientName' | 'caseType' | 'anteLitem' | 'statuteOfLimitations' | 'group' | 'stage';
type SortOrder = 'asc' | 'desc';

export function CasesTable({ cases, onEdit, onClose, onRequestClose, onApproveClose, onRejectClose }: CasesTableProps) {
  const router = useRouter();
  const { isAdmin, isAttorney } = useUser();
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

  const getGroupInfo = (caseItem: Case) => {
    if (!caseItem.parentCaseId) {
      // This is a parent case
      return {
        text: caseItem.title,
        icon: '👨‍👩‍👧‍👦',
        isParent: true,
        groupId: caseItem._id
      };
    } else {
      // This is a child case
      const parentCase = cases.find(c => c._id === caseItem.parentCaseId);
      return {
        text: parentCase ? `↳ ${parentCase.title}` : 'Unknown Parent',
        icon: '👨‍👩‍👧',
        isParent: false,
        groupId: caseItem.parentCaseId || caseItem._id
      };
    }
  };

  const getGroupColor = (groupId: string) => {
    // Create a consistent color based on group ID
    const colors = [
      'bg-blue-50 border-blue-200',
      'bg-green-50 border-green-200',
      'bg-purple-50 border-purple-200',
      'bg-yellow-50 border-yellow-200',
      'bg-pink-50 border-pink-200',
      'bg-indigo-50 border-indigo-200',
      'bg-red-50 border-red-200',
      'bg-teal-50 border-teal-200'
    ];
    
    // Use a simple hash of the group ID to get consistent colors
    let hash = 0;
    for (let i = 0; i < groupId.length; i++) {
      hash = groupId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
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
        case 'anteLitem':
          aValue = a.anteLitemRequired ? 1 : 0;
          bValue = b.anteLitemRequired ? 1 : 0;
          break;
        case 'statuteOfLimitations':
          aValue = a.statuteOfLimitations ? new Date(a.statuteOfLimitations.solDate).getTime() : 0;
          bValue = b.statuteOfLimitations ? new Date(b.statuteOfLimitations.solDate).getTime() : 0;
          break;
        case 'group':
          // Sort by parent case title, or case title if no parent
          const aParent = cases.find(c => c._id === a.parentCaseId);
          const bParent = cases.find(c => c._id === b.parentCaseId);
          aValue = aParent ? aParent.title.toLowerCase() : a.title.toLowerCase();
          bValue = bParent ? bParent.title.toLowerCase() : b.title.toLowerCase();
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Number
                </th>
                <SortableHeader field="group">
                  Group
                </SortableHeader>
                <SortableHeader field="clientName">
                  Client
                </SortableHeader>
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
                <SortableHeader field="anteLitem">
                  Ante Litem
                </SortableHeader>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCases.map((caseItem) => {
                const groupInfo = getGroupInfo(caseItem);
                const groupColor = getGroupColor(groupInfo.groupId);
                
                return (
                  <tr
                    key={caseItem._id}
                    className={`hover:bg-gray-50 cursor-pointer border-l-4 ${groupColor}`}
                    onClick={() => handleRowClick(caseItem._id)}
                  >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {caseItem.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {caseItem.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {caseItem.caseNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <span className={getGroupInfo(caseItem).isParent ? 'font-medium' : ''}>
                        {getGroupInfo(caseItem).text}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {caseItem.clientId.name}
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {caseItem.anteLitemRequired ? (
                      <Badge variant="warning">Required</Badge>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(caseItem);
                      }}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    
                    {/* Show different buttons based on user role and case status */}
                    {caseItem.stage !== 'closed' && (
                      <>
                        {isAttorney && !caseItem.closeRequested && onRequestClose && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const reason = prompt('Please provide a reason for requesting case closure:');
                              if (reason) {
                                onRequestClose(caseItem._id, reason);
                              }
                            }}
                            className="mr-2"
                          >
                            Request Close
                          </Button>
                        )}
                        
                        {isAdmin && caseItem.closeRequested && onApproveClose && onRejectClose && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Approve this close request?')) {
                                  onApproveClose(caseItem._id);
                                }
                              }}
                              className="mr-2"
                            >
                              Approve Close
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Reject this close request?')) {
                                  onRejectClose(caseItem._id);
                                }
                              }}
                              className="mr-2"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {isAdmin && !caseItem.closeRequested && onClose && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to close this case?')) {
                                onClose(caseItem._id);
                              }
                            }}
                          >
                            Close Case
                          </Button>
                        )}
                      </>
                    )}
                    
                    {/* Show close request status */}
                    {caseItem.closeRequested && (
                      <Badge variant="warning" className="ml-2">
                        Close Requested
                      </Badge>
                    )}
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