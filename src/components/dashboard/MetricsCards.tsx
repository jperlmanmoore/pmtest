'use client';

import { Card } from '../ui/Card';
import { useRouter } from 'next/navigation';

interface DashboardMetrics {
  openCases: number;
  closedCases: number;
  anteLitemCases: number;
  overOneYearCases: number;
  solCases: number;
}

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const router = useRouter();

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
      title: 'SOL Alert',
      value: metrics.solCases,
      icon: 'S',
      color: 'bg-yellow-500',
      clickable: true,
      onClick: () => router.push('/cases?filter=solalert'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
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
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}