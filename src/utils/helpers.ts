import { Case, DashboardMetrics } from '../types';

/**
 * Calculate dashboard metrics from cases data
 */
export function calculateMetrics(cases: Case[]): DashboardMetrics {
  const openCases = cases.filter(c => c.stage !== 'closed').length;
  const closedCases = cases.filter(c => c.stage === 'closed').length;
  const anteLitemCases = cases.filter(c => c.anteLitemRequired).length;

  const overOneYearCases = cases.filter(c => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return new Date(c.dateOfLoss) < oneYearAgo;
  }).length;

  const solCases = cases.filter(c => {
    const now = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    const sol = new Date(c.dateOfLoss);
    sol.setFullYear(sol.getFullYear() + 2);
    return sol <= sixMonthsFromNow && sol >= now;
  }).length;

  return {
    openCases,
    closedCases,
    anteLitemCases,
    overOneYearCases,
    solCases,
  };
}

/**
 * Get stage color for UI display
 */
export function getStageColor(stage: string): string {
  switch (stage) {
    case 'intake':
      return 'bg-blue-100 text-blue-800';
    case 'opening':
      return 'bg-cyan-100 text-cyan-800';
    case 'treating':
      return 'bg-green-100 text-green-800';
    case 'demandPrep':
      return 'bg-yellow-100 text-yellow-800';
    case 'negotiation':
      return 'bg-orange-100 text-orange-800';
    case 'settlement':
      return 'bg-purple-100 text-purple-800';
    case 'resolution':
      return 'bg-indigo-100 text-indigo-800';
    case 'probate':
      return 'bg-pink-100 text-pink-800';
    case 'closed':
      return 'bg-gray-100 text-slate-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Generate unique ID for new items
 */
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}