'use client';

import { Card } from '../ui/Card';
import { useRouter } from 'next/navigation';
import { Case } from '../../types';

interface DashboardMetrics {
  openCases: number;
  closedCases: number;
  anteLitemCases: number;
  overOneYearCases: number;
  solCases: number;
}

interface MetricsCardsProps {
  metrics: DashboardMetrics;
  cases?: Case[];
}

export function MetricsCards({ metrics, cases = [] }: MetricsCardsProps) {
  const router = useRouter();

  // Calculate demand prep metrics
  const demandPrepCases = cases.filter(c => c.stage === 'demandPrep');
  const demandPrepMetrics = {
    total: demandPrepCases.length,
    assigned: demandPrepCases.filter(c => c.assignedAttorney).length,
    nextDue: demandPrepCases
      .filter(c => c.anteLitemDeadline)
      .sort((a, b) => new Date(a.anteLitemDeadline!).getTime() - new Date(b.anteLitemDeadline!).getTime())
      .find(c => new Date(c.anteLitemDeadline!) > new Date())
  };

  const cards = [
    {
      title: 'Open Cases',
      value: metrics.openCases,
      icon: 'O',
      color: 'bg-blue-500',
      clickable: true,
      onClick: () => router.push('/cases'),
    },
    {
      title: 'Case Review Checklist',
      value: '',
      icon: '📋',
      color: 'bg-purple-500',
      clickable: true,
      onClick: () => router.push('/overview'),
    },
    {
      title: 'Demand Prep',
      value: demandPrepMetrics.total,
      icon: '📋',
      color: 'bg-yellow-500',
      clickable: true,
      onClick: () => router.push('/demand-prep'),
      subtitle: demandPrepMetrics.nextDue
        ? `Next: ${new Date(demandPrepMetrics.nextDue.anteLitemDeadline!).toLocaleDateString()}`
        : undefined,
    },
    {
      title: 'Closed Cases',
      value: metrics.closedCases,
      icon: 'C',
      color: 'bg-green-500',
      clickable: true,
      onClick: () => router.push('/cases?filter=closed'),
    },
    {
      title: 'Ante Litem',
      value: metrics.anteLitemCases,
      icon: 'A',
      color: 'bg-orange-500',
      clickable: true,
      onClick: () => router.push('/cases?filter=antelitem'),
    },
    {
      title: 'Over 1 Year',
      value: metrics.overOneYearCases,
      icon: 'Y',
      color: 'bg-red-500',
      clickable: true,
      onClick: () => router.push('/cases?filter=overyear'),
    },
    {
      title: 'Package Tracking',
      value: '',
      icon: '📦',
      color: 'bg-indigo-500',
      clickable: true,
      onClick: () => router.push('/packages'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6 mb-8">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`p-6 ${card.clickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
          onClick={card.clickable ? card.onClick : undefined}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 ${card.color} rounded-md flex items-center justify-center`}>
                <span className="text-white text-sm font-semibold">{card.icon}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value || 'View'}</p>
              {card.subtitle && (
                <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}