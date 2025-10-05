'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Case, Task } from '../../types';
import { useCases } from '../../hooks/useCases';
import { useTasks } from '../../hooks/useTasks';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import TaskDebugComponent from '../../components/TaskDebugComponent';

const TASK_COLUMNS = [
  'Initial Client Contact',
  'Gather Medical Records',
  'Review Police Report',
  'Obtain Witness Statements',
  'Calculate Damages',
  'Prepare Demand Letter',
  'Attorney Review',
  'File Ante Litem Notice',
  'Send Demand Package',
  'Follow Up on Demand',
  'Prepare for Mediation',
  'Document Settlement',
  'Close Case'
];

const STATUS_CONFIG = {
  pending: { color: 'bg-gray-200', symbol: '○', label: 'Not Started' },
  in_progress: { color: 'bg-blue-200', symbol: '🔄', label: 'In Progress' },
  completed: { color: 'bg-green-200', symbol: '✅', label: 'Complete' },
  cancelled: { color: 'bg-red-200', symbol: '❌', label: 'Cancelled' },
  overdue: { color: 'bg-red-100', symbol: '⚠️', label: 'Overdue' }
};

interface CaseMatrixData {
  case: Case;
  tasks: Record<string, Task | null>;
  stats: {
    completed: number;
    in_progress: number;
    pending: number;
    overdue: number;
    cancelled: number;
    total: number;
  };
}

interface CaseTaskStats {
  completed: number;
  in_progress: number;
  pending: number;
  overdue: number;
  cancelled: number;
  total: number;
}

export default function DemandPrepPage() {
  const router = useRouter();
  const { cases, loading: casesLoading } = useCases();
  const { tasks, loading: tasksLoading, updateTask } = useTasks();

  // Filter cases to only show demand prep cases
  const demandPrepCases = useMemo(() => {
    return cases.filter(c => c.stage === 'demandPrep');
  }, [cases]);

  // Create matrix data: case -> task -> status
  const caseTaskMatrix = useMemo(() => {
    console.log('=== BUILDING DEMAND PREP CASE TASK MATRIX ===');
    console.log('Demand Prep Cases for Matrix:', demandPrepCases.length);
    console.log('Available Tasks:', tasks.length);

    const matrix: Record<string, CaseMatrixData> = {};

    demandPrepCases.forEach(caseItem => {
      console.log(`Processing demand prep case: ${caseItem._id} - ${caseItem.title}`);

      matrix[caseItem._id] = {
        case: caseItem,
        tasks: {},
        stats: { completed: 0, in_progress: 0, pending: 0, overdue: 0, cancelled: 0, total: 0 }
      };

      // Get tasks for this case
      const caseTasks = tasks.filter(task => task.caseId === caseItem._id);
      console.log(`Tasks found for case ${caseItem._id}:`, caseTasks.length);

      // Initialize all task columns for all cases
      TASK_COLUMNS.forEach(taskName => {
        const task = caseTasks.find(t => t.title === taskName);
        if (task) {
          matrix[caseItem._id].tasks[taskName] = task;

          // Check if task is overdue for stats counting
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
  }, [demandPrepCases, tasks]);

  // Handle task status updates
  const handleTaskClick = async (caseId: string, taskName: string, currentTask: Task | null, caseStage: string) => {
    console.log('=== TASK CLICK DEBUG ===');
    console.log('Case ID:', caseId);
    console.log('Task Name:', taskName);
    console.log('Current Task:', currentTask);
    console.log('Case Stage:', caseStage);

    if (!currentTask) {
      console.log('No task found - would create new task');
      return;
    }

    // Cycle through statuses
    const statusCycle: Task['status'][] = ['pending', 'in_progress', 'completed'];
    const currentIndex = statusCycle.indexOf(currentTask.status);
    const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextStatus = statusCycle[(safeCurrentIndex + 1) % statusCycle.length];

    console.log('Current status:', currentTask.status);
    console.log('Next status:', nextStatus);

    try {
      console.log('Calling updateTask with:', { taskId: currentTask._id, status: nextStatus });
      await updateTask(currentTask._id, { status: nextStatus });
      console.log('Task updated successfully');
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
      case 'demandPrep': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onAddCase={() => {}} showAddForm={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/')}
            variant="secondary"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Demand Prep Cases</h1>
          <p className="text-gray-600 mt-1">Task progress for all demand preparation cases</p>
        </div>
        <TaskDebugComponent />
        <div className="space-y-6">
          {/* Loading State */}
          {casesLoading || tasksLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading demand prep cases and tasks...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">{demandPrepCases.length}</div>
                    <div className="text-sm text-gray-600">Total Demand Prep Cases</div>
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
                    <div className="text-2xl font-bold text-blue-600">
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
                  <h3 className="text-lg font-semibold">Demand Prep Task Progress Matrix</h3>
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

                          return (
                          <tr key={caseId} className="border-b hover:bg-gray-50">
                            {/* Case Details Column */}
                            <td className="p-4 sticky left-0 bg-white z-10">
                              <div className="min-w-[200px]">
                                <div className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                     onClick={() => router.push(`/cases/${caseId}`)}>
                                  {caseData.case.clientId?.name}
                                </div>
                                <div className="text-sm text-gray-600">{caseData.case.title}</div>
                                <div className="text-xs text-gray-500 mt-1 max-w-[180px] truncate" title={getCaseSummary(caseData.case)}>
                                  {getCaseSummary(caseData.case)}
                                </div>
                                <div className="flex gap-2 mt-1">
                                  <Badge className={getStageColor(caseData.case.stage)}>
                                    {caseData.case.stage}
                                  </Badge>
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
                                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
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