import React from 'react';
import { TaskList } from '../components/TaskList';
import { Task } from '../types';

// Demo data for the task management system
const demoTasks: Task[] = [
  {
    _id: 'task-1',
    caseId: 'case-1',
    title: 'Initial Client Consultation',
    description: 'Conduct initial consultation with client to gather case details and establish rapport',
    stage: 'intake',
    status: 'completed',
    priority: 'high',
    assignedTo: { _id: 'user-1', name: 'John Smith', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-15T10:00:00Z',
    dueDate: '2025-01-20T17:00:00Z',
    completedAt: '2025-01-16T14:30:00Z',
    completedBy: 'user-1',
    isStandard: true,
    templateId: 'template-intake',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-16T14:30:00Z'
  },
  {
    _id: 'task-2',
    caseId: 'case-1',
    title: 'Gather Medical Records',
    description: 'Request and collect all relevant medical records from treating providers',
    stage: 'treating',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: { _id: 'user-2', name: 'Sarah Johnson', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-16T11:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    isStandard: true,
    templateId: 'template-treating',
    createdAt: '2025-01-16T10:00:00Z',
    updatedAt: '2025-01-16T11:00:00Z'
  },
  {
    _id: 'task-3',
    caseId: 'case-1',
    title: 'Draft Settlement Demand',
    description: 'Prepare comprehensive settlement demand letter with all supporting documentation',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'user-3', name: 'Mike Davis', role: 'attorney' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-20T09:00:00Z',
    dueDate: '2025-02-10T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-01-20T09:00:00Z'
  },
  {
    _id: 'task-4',
    caseId: 'case-1',
    title: 'Medical Chronology Creation',
    description: 'Create detailed chronology of medical treatment and recovery',
    stage: 'treating',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'user-2', name: 'Sarah Johnson', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-18T14:00:00Z',
    dueDate: '2025-02-01T17:00:00Z',
    isStandard: true,
    templateId: 'template-treating',
    createdAt: '2025-01-18T13:00:00Z',
    updatedAt: '2025-01-18T14:00:00Z'
  },
  {
    _id: 'task-5',
    caseId: 'case-1',
    title: 'Insurance Policy Review',
    description: 'Review all applicable insurance policies and coverage details',
    stage: 'opening',
    status: 'completed',
    priority: 'high',
    assignedTo: { _id: 'user-1', name: 'John Smith', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-17T10:00:00Z',
    dueDate: '2025-01-25T17:00:00Z',
    completedAt: '2025-01-22T16:00:00Z',
    completedBy: 'user-1',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-17T09:00:00Z',
    updatedAt: '2025-01-22T16:00:00Z'
  },
  {
    _id: 'task-6',
    caseId: 'case-1',
    title: 'Client Medical Assessment',
    description: 'Assess immediate medical needs and connect client with appropriate care providers',
    stage: 'intake',
    status: 'completed',
    priority: 'urgent',
    assignedTo: { _id: 'user-1', name: 'John Smith', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-15T11:00:00Z',
    dueDate: '2025-01-16T17:00:00Z',
    completedAt: '2025-01-15T15:30:00Z',
    completedBy: 'user-1',
    isStandard: true,
    templateId: 'template-intake',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T15:30:00Z'
  }
];

export function TaskDemo() {
  const tasks = demoTasks;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Management System</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive task management for personal injury cases with standard templates and workflow automation.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">📋 Standard Task Templates</h3>
              <p className="text-sm text-gray-600">
                Pre-defined task templates for each case stage (intake, treating, demand prep, etc.)
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">👥 Dual Assignment System</h3>
              <p className="text-sm text-gray-600">
                Tasks can be assigned to attorneys or case managers based on requirements
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">📊 Advanced Filtering</h3>
              <p className="text-sm text-gray-600">
                Filter and sort tasks by status, priority, due date, and assignment
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">⏰ Due Date Tracking</h3>
              <p className="text-sm text-gray-600">
                Automated due date calculation and overdue task highlighting
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">📈 Progress Analytics</h3>
              <p className="text-sm text-gray-600">
                Real-time statistics and progress tracking for case management
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">🔄 Workflow Automation</h3>
              <p className="text-sm text-gray-600">
                Automated task creation and status updates based on case progression
              </p>
            </div>
          </div>
        </div>

        <TaskList
          tasks={tasks}
        />

        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Implementation Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">✅ Task Data Models</span>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">✅ Standard Task Templates</span>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">✅ Task Management Hooks</span>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">✅ TaskList Component (Basic)</span>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">🔄 TaskItem Component (Detailed)</span>
              <span className="text-yellow-600 font-medium">In Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">🔄 Task Creation Forms</span>
              <span className="text-yellow-600 font-medium">In Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">🔄 Task Assignment UI</span>
              <span className="text-yellow-600 font-medium">In Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">⏳ Integration with Case Views</span>
              <span className="text-gray-600 font-medium">Planned</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">⏳ Template Application Logic</span>
              <span className="text-gray-600 font-medium">Planned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}