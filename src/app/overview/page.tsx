'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useCases } from '../../hooks/useCases';
import { useTasks } from '../../hooks/useTasks';
import { useUser } from '../../contexts/UserContext';
import { Case, Task } from '../../types';

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
  const [filterStage, setFilterStage] = useState('all');

  // Add comprehensive debugging
  console.log('=== CHECKLIST DEBUG ===');
  console.log('Current User:', useUser());
  console.log('All Cases:', cases);
  console.log('All Tasks:', tasks);
  console.log('Cases Loading:', casesLoading);
  console.log('Tasks Loading:', tasksLoading);
  console.log('Filter Stage:', filterStage);
  console.log('Is Intake User:', isIntake);

  // Filter cases based on user role and stage
  const filteredCases = useMemo(() => {
    let filtered = cases;

    // Exclude intake cases from overview display
    filtered = filtered.filter(c => c.stage !== 'intake');

    // Apply stage filter
    if (filterStage !== 'all') {
      filtered = filtered.filter(c => c.stage === filterStage);
    }

    // Apply role-based filtering (intake users only see intake cases)
    if (isIntake) {
      filtered = filtered.filter(c => c.stage === 'intake');
    }

    console.log('Filtered Cases Result:', filtered);
    console.log('Filtered Cases Count:', filtered.length);

    return filtered;
  }, [cases, filterStage, isIntake]);

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Case Progress Checkoff Grid</h1>
              <p className="text-gray-600 mt-1">Visual overview of task completion across all cases</p>
            </div>
            <div className="flex items-center space-x-6">
              <Button
                onClick={() => router.push('/')}
                variant="secondary"
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <div className="flex justify-end gap-4">
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
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