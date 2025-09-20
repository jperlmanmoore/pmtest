import { useState, useEffect } from 'react';
import { Task, TaskTemplate } from '../types';
import { standardTaskTemplates, getTemplateForStage as getTemplateFromData } from '../data/taskTemplates';

// Mock data for development - replace with API calls later
const mockTasks: Task[] = [
  {
    _id: 'task-1',
    caseId: 'case-1',
    title: 'Initial Client Consultation',
    description: 'Conduct initial consultation with client to gather case details',
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
    description: 'Request and collect all relevant medical records from providers',
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
  }
];

export function useTasks(caseId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (caseId) {
      // Filter tasks for specific case
      const caseTasks = mockTasks.filter(task => task.caseId === caseId);
      setTasks(caseTasks);
    } else {
      setTasks(mockTasks);
    }
  }, [caseId]);

  const createTask = async (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const newTask: Task = {
        ...taskData,
        _id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setLoading(true);
      setTasks(prev => prev.map(task =>
        task._id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ));
    } catch (err) {
      setError('Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignTask = async (taskId: string, userId: string, userName: string, userRole: 'attorney' | 'caseManager') => {
    try {
      setLoading(true);
      await updateTask(taskId, {
        assignedTo: { _id: userId, name: userName, role: userRole },
        assignedAt: new Date().toISOString(),
        status: 'in_progress'
      });
    } catch (err) {
      setError('Failed to assign task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string, userId: string) => {
    try {
      setLoading(true);
      await updateTask(taskId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        completedBy: userId
      });
    } catch (err) {
      setError('Failed to complete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    completeTask
  };
}

export function useTaskTemplates() {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use the comprehensive standard templates instead of mock data
    setTemplates(standardTaskTemplates);
  }, []);

  const getTemplateForStage = (stage: Task['stage']) => {
    return getTemplateFromData(stage);
  };

  const applyTemplateToCase = async (caseId: string, templateId: string, assignedAttorney?: { _id: string; name: string }) => {
    try {
      setLoading(true);
      const template = templates.find(t => t._id === templateId);
      if (!template) throw new Error('Template not found');

      const newTasks: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>[] = template.tasks.map(taskTemplate => ({
        caseId,
        title: taskTemplate.title,
        description: taskTemplate.description,
        stage: template.stage,
        status: 'pending',
        priority: taskTemplate.priority,
        assignedTo: taskTemplate.assignedToRole === 'attorney' && assignedAttorney
          ? { _id: assignedAttorney._id, name: assignedAttorney.name, role: 'attorney' }
          : undefined,
        assignedBy: 'system', // Auto-assigned from template
        assignedAt: new Date().toISOString(),
        dueDate: taskTemplate.estimatedDays
          ? new Date(Date.now() + taskTemplate.estimatedDays * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
        isStandard: true,
        templateId: template._id
      }));

      // Create all tasks using the createTask function from useTasks
      // Note: This would need to be refactored to properly integrate with useTasks hook
      for (const taskData of newTasks) {
        console.log('Creating task from template:', taskData);
        // In a real implementation, this would call the API
      }

    } catch (err) {
      setError('Failed to apply template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    templates,
    loading,
    error,
    getTemplateForStage,
    applyTemplateToCase
  };
}