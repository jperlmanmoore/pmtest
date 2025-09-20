import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { useUser } from '../contexts/UserContext';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onAssignTask?: (taskId: string, userId: string, userName: string, userRole: 'attorney' | 'caseManager') => void;
  onCompleteTask?: (taskId: string, userId: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
}

type FilterStatus = Task['status'] | 'all';
type FilterPriority = Task['priority'] | 'all';
type SortOption = 'title' | 'assignedTo' | 'status' | 'priority' | 'dueDate' | 'createdAt';

export function TaskList({
  tasks,
  loading = false,
  onAssignTask,
  onCompleteTask,
  onUpdateTask
}: TaskListProps) {
  const { currentUser, isAdmin, isAttorney, isCaseManager } = useUser();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showCompleted, setShowCompleted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Hide completed tasks if requested
    if (!showCompleted) {
      filtered = filtered.filter(task => task.status !== 'completed');
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'assignedTo':
          aValue = a.assignedTo?.name || '';
          bValue = b.assignedTo?.name || '';
          break;
        case 'status':
          const statusOrder = { pending: 0, in_progress: 1, completed: 2, cancelled: 3 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, statusFilter, priorityFilter, sortBy, sortDirection, showCompleted, searchQuery]);

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== 'completed'
    ).length;

    return { total, completed, inProgress, pending, overdue };
  };

  const handleSort = (field: SortOption) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortOption) => {
    if (sortBy !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter tasks by status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as FilterPriority)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter tasks by priority"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Show Completed Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCompleted"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showCompleted" className="ml-2 text-sm text-gray-700">
                Show Completed
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th
                  className="text-left p-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  Task Name {getSortIcon('title')}
                </th>
                <th
                  className="text-left p-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('assignedTo')}
                >
                  Assigned To {getSortIcon('assignedTo')}
                </th>
                <th
                  className="text-left p-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIcon('status')}
                </th>
                <th
                  className="text-left p-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('priority')}
                >
                  Priority {getSortIcon('priority')}
                </th>
                <th
                  className="text-left p-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date {getSortIcon('dueDate')}
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    {tasks.length === 0 ? 'No tasks found for this case.' : 'No tasks match the current filters.'}
                  </td>
                </tr>
              ) : (
                filteredAndSortedTasks.map((task) => {
                  const canAssign = isAdmin || (isAttorney && task.stage && task.stage !== 'settlement');
                  const canComplete = task.assignedTo?._id === currentUser?._id;
                  const canUpdate = isAdmin || canComplete;

                  return (
                    <tr key={task._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{task.description || 'No description'}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        {task.assignedTo ? (
                          <div>
                            <div className="font-medium text-gray-900">{task.assignedTo.name}</div>
                            <div className="text-sm text-gray-600">{task.assignedTo.role}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          task.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        {task.dueDate ? (
                          <div>
                            <div className="text-sm text-gray-900">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            {new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                              <div className="text-xs text-red-600 font-medium">Overdue</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">No due date</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {/* Assign Button - for admins and attorneys */}
                          {canAssign && !task.assignedTo && onAssignTask && (
                            <button
                              onClick={() => {
                                if (isAttorney) {
                                  onAssignTask(task._id, currentUser!._id, currentUser!.name, 'attorney');
                                } else if (isCaseManager) {
                                  onAssignTask(task._id, currentUser!._id, currentUser!.name, 'caseManager');
                                }
                              }}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                              title="Assign to me"
                            >
                              Assign
                            </button>
                          )}

                          {/* Complete Button - for assigned users */}
                          {canComplete && task.status !== 'completed' && onCompleteTask && (
                            <button
                              onClick={() => onCompleteTask(task._id, currentUser!._id)}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                              title="Mark as completed"
                            >
                              Complete
                            </button>
                          )}

                          {/* Status Update - for admins and assigned users */}
                          {canUpdate && task.status !== 'completed' && onUpdateTask && (
                            <select
                              value={task.status}
                              onChange={(e) => onUpdateTask(task._id, { status: e.target.value as Task['status'] })}
                              className="px-2 py-1 text-xs border border-gray-300 rounded"
                              title="Update status"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}