'use client';

console.log('OVERVIEW PAGE: File loaded and executing');

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useCases } from '../../hooks/useCases';
import { useTasks } from '../../hooks/useTasks';
import { useUser } from '../../contexts/UserContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Case, Task } from '../../types';
import { useSearchParams } from 'next/navigation';

// Task columns organized by case stage
const TASK_COLUMNS_BY_STAGE = {
  intake: [
    'Initial Call',
    'Review Contract',
    '15 Day Case Review'
  ],
  opening: [
    'AR',
    'HI Cards',
    'HI Ltr',
    'HI Subro'
  ],
  treating: [
    'Initial Med Recs',
    'Bill HI Ltr',
    'PD Resolved',
    '30 Day Call'
  ],
  demandPrep: [
    'LOR Liability',
    'LOR UM',
    'Dec Page L',
    'Dec Page UM',
    'ACM',
    'All Bills/Recs',
    'Draft Demand'
  ],
  negotiation: [
    'Send Liability Demand',
    'Send UM Demand',
    'Med Pay Demand'
  ],
  settlement: [],
  resolution: [],
  probate: [],
  closed: []
};

// Flatten all task columns for the grid
const TASK_COLUMNS = Object.values(TASK_COLUMNS_BY_STAGE).flat();

const STATUS_CONFIG = {
  completed: { symbol: '✅', color: 'bg-green-500', label: 'Complete' },
  in_progress: { symbol: '🔄', color: 'bg-blue-500', label: 'In Progress' },
  pending: { symbol: '○', color: 'bg-gray-200', label: 'Not Started' },
  overdue: { symbol: '', color: 'bg-red-100 border border-red-300', label: 'Overdue' },
  cancelled: { symbol: '🚫', color: 'bg-gray-500', label: 'Cancelled' }
};

interface CaseTaskStats {
  completed: number;
  in_progress: number;
  pending: number;
  overdue: number;
  cancelled: number;
  total: number;
}

interface CaseMatrixData {
  case: Case;
  tasks: Record<string, Task | null>;
  stats: CaseTaskStats;
}

export default function OverviewPage() {
  const router = useRouter();
  const { cases, loading: casesLoading } = useCases();
  const { tasks, loading: tasksLoading, updateTask } = useTasks();
  const { isIntake } = useUser();
  const searchParams = useSearchParams();
  const [filterStage, setFilterStage] = useState(searchParams?.get('stage') || 'all');
  const [additionalFilter, setAdditionalFilter] = useState(searchParams?.get('filter') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'taskType' | 'client' | 'dueDate'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const getFilterDisplayName = (filter: string): string => {
    const filterNames: Record<string, string> = {
      urgent: 'Urgent Cases (SOL Alert)',
      recent: 'Recent Cases'
    };
    return filterNames[filter] || filter.charAt(0).toUpperCase() + filter.slice(1);
  };

  // Filter cases based on user role and stage
  const filteredCases = useMemo(() => {
    let filtered = cases;

    // Exclude intake cases from overview display
    filtered = filtered.filter(c => c.stage !== 'intake');

    // Default filter: only show treating and demandPrep cases
    // Plus negotiation/settlement cases that have showInChecklist enabled
    filtered = filtered.filter(c => {
      if (c.stage === 'treating' || c.stage === 'demandPrep') {
        return true;
      }
      if ((c.stage === 'negotiation' || c.stage === 'settlement') && c.showInChecklist) {
        return true;
      }
      return false;
    });

    // Apply stage filter if not "all"
    if (filterStage !== 'all') {
      filtered = filtered.filter(c => c.stage === filterStage);
    }

    // Apply additional filters
    if (additionalFilter === 'urgent') {
      const now = new Date();
      const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(caseItem => {
        if (!caseItem.statuteOfLimitations) return false;
        const solDate = new Date(caseItem.statuteOfLimitations.solDate);
        return solDate <= ninetyDaysFromNow && solDate >= now;
      });
    } else if (additionalFilter === 'recent') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(caseItem => 
        new Date(caseItem.createdAt || caseItem.dateOfLoss) > thirtyDaysAgo
      );
    }

    // Apply role-based filtering (intake users only see intake cases)
    if (isIntake) {
      filtered = filtered.filter(c => c.stage === 'intake');
    }

    console.log('Filtered Cases Result:', filtered);
    console.log('Filtered Cases Count:', filtered.length);

    return filtered;
  }, [cases, filterStage, additionalFilter, isIntake]);

  // Create matrix data: case -> task -> status
  const caseTaskMatrix = useMemo(() => {
    console.log('=== BUILDING CASE TASK MATRIX ===');
    console.log('Filtered Cases for Matrix:', filteredCases.length);
    console.log('Available Tasks:', tasks.length);
    console.log('Tasks details:', tasks.map(t => ({ id: t._id, title: t.title, caseId: t.caseId, status: t.status })));

    const matrix: Record<string, CaseMatrixData> = {};

    filteredCases.forEach(caseItem => {
      console.log(`Processing case: ${caseItem._id} - ${caseItem.title}`);

      matrix[caseItem._id] = {
        case: caseItem,
        tasks: {},
        stats: { completed: 0, in_progress: 0, pending: 0, overdue: 0, cancelled: 0, total: 0 }
      };

      // Get tasks for this case
      const caseTasks = tasks.filter(task => task.caseId === caseItem._id);
      console.log(`Tasks found for case ${caseItem._id}:`, caseTasks.length);
      console.log(`Task details:`, caseTasks.map(t => ({ id: t._id, title: t.title, status: t.status })));

      // Initialize all task columns for all cases (no stage filtering)
      TASK_COLUMNS.forEach(taskName => {
        const task = caseTasks.find(t => t.title === taskName);
        if (task) {
          matrix[caseItem._id].tasks[taskName] = task;

          // Check if task is overdue for stats counting (only count pending overdue tasks)
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';

          if (isOverdue) {
            matrix[caseItem._id].stats.overdue = (matrix[caseItem._id].stats.overdue || 0) + 1;
          } else {
            matrix[caseItem._id].stats[task.status] = (matrix[caseItem._id].stats[task.status] || 0) + 1;
          }

          console.log(`Task "${taskName}" found for case ${caseItem._id}:`, task.status, isOverdue ? '(overdue)' : '');
        } else {
          matrix[caseItem._id].tasks[taskName] = null;
          matrix[caseItem._id].stats.pending = (matrix[caseItem._id].stats.pending || 0) + 1;
          console.log(`Task "${taskName}" NOT found for case ${caseItem._id}, setting to null`);
        }
        matrix[caseItem._id].stats.total += 1;
      });

      console.log(`Final stats for case ${caseItem._id}:`, matrix[caseItem._id].stats);
    });

    console.log('=== MATRIX BUILDING COMPLETE ===');
    console.log('Final Matrix Keys:', Object.keys(matrix));

    return matrix;
  }, [filteredCases, tasks]);

  // Create flattened task list for table view
  const flattenedTasks = useMemo(() => {
    const taskList: Array<{
      task: Task;
      case: Case;
      isOverdue: boolean;
    }> = [];

    filteredCases.forEach(caseItem => {
      const caseTasks = tasks.filter(task => task.caseId === caseItem._id);
      
      caseTasks.forEach(task => {
        const isOverdue = !!(task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending');
        taskList.push({
          task,
          case: caseItem,
          isOverdue
        });
      });
    });

    return taskList;
  }, [filteredCases, tasks]);

  // Sort flattened tasks for table view
  const sortedTasks = useMemo(() => {
    return [...flattenedTasks].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'taskType':
          comparison = a.task.title.localeCompare(b.task.title);
          break;
        case 'client':
          comparison = (a.case.clientId?.name || '').localeCompare(b.case.clientId?.name || '');
          break;
        case 'dueDate':
          const aDate = a.task.dueDate ? new Date(a.task.dueDate).getTime() : Infinity;
          const bDate = b.task.dueDate ? new Date(b.task.dueDate).getTime() : Infinity;
          comparison = aDate - bDate;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [flattenedTasks, sortBy, sortOrder]);

  // Handle task status updates
  const handleTaskClick = async (caseId: string, taskName: string, currentTask: Task | null, caseStage: string) => {
    console.log('=== TASK CLICK DEBUG ===');
    console.log('Case ID:', caseId);
    console.log('Task Name:', taskName);
    console.log('Current Task:', currentTask);
    console.log('Case Stage:', caseStage);
    console.log('All available tasks:', tasks.map(t => ({ id: t._id, title: t.title, caseId: t.caseId, status: t.status })));

    // Allow clicking on all tasks regardless of stage
    if (!currentTask) {
      console.log('No task found - would create new task');
      console.log('Available tasks for this case:', tasks.filter(t => t.caseId === caseId));
      return;
    }

    // Always cycle through statuses using the actual task status, not display status
    const statusCycle: Task['status'][] = ['pending', 'in_progress', 'completed'];
    const currentIndex = statusCycle.indexOf(currentTask.status);

    // If status is not found in cycle (shouldn't happen), default to 0
    const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextStatus = statusCycle[(safeCurrentIndex + 1) % statusCycle.length];

    console.log('Current status:', currentTask.status);
    console.log('Current index in cycle:', safeCurrentIndex);
    console.log('Next status:', nextStatus);

    try {
      console.log('Calling updateTask with:', { taskId: currentTask._id, status: nextStatus });
      await updateTask(currentTask._id, { status: nextStatus });
      console.log('Task updated successfully');

      // Force a re-render by triggering the matrix rebuild
      console.log('Forcing matrix rebuild...');
      // The useMemo should automatically re-run when tasks change
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // Calculate completion percentage
  const getCompletionPercentage = (stats: CaseTaskStats) => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  // Get stage color
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'intake': return 'bg-blue-100 text-blue-800';
      case 'opening': return 'bg-indigo-100 text-indigo-800';
      case 'treating': return 'bg-green-100 text-green-800';
      case 'demandPrep': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'settlement': return 'bg-purple-100 text-purple-800';
      case 'resolution': return 'bg-teal-100 text-teal-800';
      case 'probate': return 'bg-pink-100 text-pink-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onAddCase={() => {}} showAddForm={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {filterStage !== 'all' ? `${getStageDisplayName(filterStage)} Cases` :
             additionalFilter ? getFilterDisplayName(additionalFilter) :
             viewMode === 'grid' ? 'Case Progress Checkoff Grid' : 'Case Review Task List'}
          </h1>
          <p className="text-gray-600 mt-1">
            {(filterStage !== 'all' || additionalFilter) ? 
              'Filtered view of case progress and task completion' :
              viewMode === 'grid' 
                ? 'Visual overview of task completion across all cases'
                : 'Detailed task list with sorting and filtering options'
            }
          </p>
          {(filterStage !== 'all' || additionalFilter) && (
            <div className="flex items-center space-x-2 mt-3">
              {filterStage !== 'all' && (
                <Badge variant="default">
                  Stage: {getStageDisplayName(filterStage)}
                </Badge>
              )}
              {additionalFilter && (
                <Badge variant="warning">
                  Filter: {getFilterDisplayName(additionalFilter)}
                </Badge>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFilterStage('all');
                  setAdditionalFilter('');
                  router.push('/overview');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-6">
          {/* Loading State */}
          {casesLoading || tasksLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading cases and tasks...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Filter Controls */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Grid View
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      viewMode === 'table'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Table View
                  </button>
                </div>
                <div className="flex gap-4">
                  {viewMode === 'table' && (
                    <div className="flex gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'taskType' | 'client' | 'dueDate')}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        aria-label="Sort tasks by"
                      >
                        <option value="dueDate">Sort by Due Date</option>
                        <option value="taskType">Sort by Task Type</option>
                        <option value="client">Sort by Client</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                        title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                      >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </button>
                    </div>
                  )}
                  <select
                    value={filterStage}
                    onChange={(e) => {
                      const newStage = e.target.value;
                      setFilterStage(newStage);
                      setAdditionalFilter(''); // Clear additional filter when changing stage
                      if (newStage === 'all') {
                        router.push('/overview');
                      } else {
                        router.push(`/overview?stage=${newStage}`);
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    aria-label="Filter cases by stage"
                  >
                    <option value="all">All Stages</option>
                    <option value="treating">Treating</option>
                    <option value="demandPrep">Demand Prep</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="settlement">Settlement</option>
                    <option value="resolution">Resolution</option>
                    <option value="closed">Closed</option>
                  </select>
                  <Button variant="secondary">Export Report</Button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{filteredCases.length}</div>
                    <div className="text-sm text-gray-600">Total Cases</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(caseTaskMatrix).reduce((sum, caseData) => sum + caseData.stats.completed, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Tasks Completed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">
                      {Object.values(caseTaskMatrix).reduce((sum, caseData) => sum + caseData.stats.in_progress, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Tasks In Progress</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {Object.values(caseTaskMatrix).reduce((sum, caseData) => sum + caseData.stats.overdue, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Overdue Tasks</div>
                  </CardContent>
                </Card>
              </div>

              {/* Checkoff Grid */}
              {viewMode === 'grid' && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Task Progress Matrix</h3>
                    <p className="text-sm text-gray-600">Click any cell to update task status</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1200px]">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-4 font-semibold sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                              Case Details
                            </th>
                            {TASK_COLUMNS.map(taskName => (
                              <th key={taskName} className="text-center p-2 font-semibold text-xs min-w-[80px]">
                                <div className="transform -rotate-45 origin-center h-16 flex items-end justify-center">
                                  {taskName}
                                </div>
                              </th>
                            ))}
                            <th className="text-center p-4 font-semibold min-w-[100px]">Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(caseTaskMatrix).map(([caseId, caseData]) => {
                            console.log(`Rendering case row: ${caseId} - ${caseData.case.title}`);
                            console.log(`Case tasks:`, Object.keys(caseData.tasks));
                            console.log(`Case stats:`, caseData.stats);

                            return (
                            <tr key={caseId} className="border-b hover:bg-gray-50">
                              {/* Case Details Column */}
                              <td className="p-4 sticky left-0 bg-white z-10">
                                <div className="min-w-[200px]">
                                  <div className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                       onClick={() => router.push(`/cases/${caseId}`)}>
                                    {caseData.case.title}
                                  </div>
                                  <div className="text-sm text-gray-600">{caseData.case.clientId?.name}</div>
                                  <div className="flex gap-2 mt-1">
                                    <Badge className={getStageColor(caseData.case.stage)}>
                                      {caseData.case.stage}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {new Date(caseData.case.dateOfLoss).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Task Status Columns */}
                              {TASK_COLUMNS.map(taskName => {
                                const task = caseData.tasks[taskName];
                                const status = task ? task.status : 'pending';

                                // Only show as overdue if task is actually overdue AND not completed or in progress
                                const isOverdue = task && task.dueDate && new Date(task.dueDate) < new Date() && status === 'pending';
                                const displayStatus = isOverdue ? 'overdue' : status;

                                const config = STATUS_CONFIG[displayStatus];

                                console.log(`Rendering task: ${taskName} for case ${caseId}`, {
                                  task: task ? { id: task._id, status: task.status } : null,
                                  status,
                                  isOverdue,
                                  displayStatus,
                                  config
                                });

                                return (
                                  <td key={taskName} className="text-center p-2">
                                    <div
                                      className={`w-8 h-8 ${config.color} rounded cursor-pointer hover:opacity-80 flex items-center justify-center text-white font-bold transition-all duration-200 mx-auto`}
                                      onClick={() => handleTaskClick(caseId, taskName, task, caseData.case.stage)}
                                      title={`${config.label}${task && task.dueDate ? ` - Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}`}
                                    >
                                      {config.symbol}
                                    </div>
                                  </td>
                                );
                              })}

                              {/* Progress Column */}
                              <td className="p-4">
                                <div className="min-w-[100px]">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">
                                      {getCompletionPercentage(caseData.stats)}%
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({caseData.stats.completed}/{caseData.stats.total})
                                    </span>
                                  </div>
                                    <div
                                      className="w-full bg-gray-200 rounded-full h-2"
                                    >
                                      <div
                                        className={`bg-green-500 h-2 rounded-full transition-all duration-300`}
                                        style={{ width: `${getCompletionPercentage(caseData.stats)}%` }}
                                      ></div>
                                    </div>
                                </div>
                              </td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Task Table View */}
              {viewMode === 'table' && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Task List</h3>
                    <p className="text-sm text-gray-600">
                      Sorted by {sortBy === 'dueDate' ? 'Due Date' : sortBy === 'taskType' ? 'Task Type' : 'Client'} 
                      ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[800px]">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-4 font-semibold">Task</th>
                            <th className="text-left p-4 font-semibold">Case</th>
                            <th className="text-left p-4 font-semibold">Client</th>
                            <th className="text-left p-4 font-semibold">Stage</th>
                            <th className="text-left p-4 font-semibold">Status</th>
                            <th className="text-left p-4 font-semibold">Due Date</th>
                            <th className="text-left p-4 font-semibold">Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedTasks.map(({ task, case: caseItem, isOverdue }) => {
                            const config = STATUS_CONFIG[isOverdue ? 'overdue' : task.status];

                            return (
                              <tr key={task._id} className="border-b hover:bg-gray-50">
                                <td className="p-4">
                                  <div>
                                    <div className="font-medium text-gray-900">{task.title}</div>
                                    {task.description && (
                                      <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div 
                                    className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                    onClick={() => router.push(`/cases/${caseItem._id}`)}
                                  >
                                    {caseItem.title}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {new Date(caseItem.dateOfLoss).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-gray-900">{caseItem.clientId?.name || 'Unknown'}</div>
                                </td>
                                <td className="p-4">
                                  <Badge className={getStageColor(caseItem.stage)}>
                                    {caseItem.stage}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-6 h-6 ${config.color} rounded cursor-pointer hover:opacity-80 flex items-center justify-center text-white font-bold text-xs`}
                                      onClick={() => handleTaskClick(caseItem._id, task.title, task, caseItem.stage)}
                                      title={`Click to change status: ${config.label}`}
                                    >
                                      {config.symbol}
                                    </div>
                                    <span className="text-sm">{config.label}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                    {isOverdue && <span className="ml-2 text-xs">(Overdue)</span>}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge className={
                                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }>
                                    {task.priority || 'low'}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Legend */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Status Legend</h3>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                      <div key={status} className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${config.color} rounded`}></div>
                        <span className="text-sm">{config.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Click any status indicator to cycle through: ○ Not Started → 🔄 In Progress → ✅ Complete → ○ Not Started
                    <br />
                    <span className="text-xs text-red-600">Overdue tasks (past due date and not started) are highlighted with light red background</span>
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}