import { useState, useEffect, useRef, useMemo } from 'react';
import { Task, TaskTemplate } from '../types';
import { standardTaskTemplates, getTemplateForStage as getTemplateFromData } from '../data/taskTemplates';
import { useUser } from '../contexts/UserContext';

// Mock data for development - replace with API calls later
const mockTasks: Task[] = [
  // Case 1 tasks
  {
    _id: 'task-1',
    caseId: '1',
    title: 'Initial Call',
    description: 'Conduct initial consultation with client to gather case details',
    stage: 'intake',
    status: 'pending',
    priority: 'urgent',
    assignedTo: { _id: 'attorney-1', name: 'Attorney', role: 'attorney' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-15T10:00:00Z',
    dueDate: '2025-10-15T17:00:00Z', // Future date for testing
    isStandard: true,
    templateId: 'template-intake',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-16T14:30:00Z'
  },
  {
    _id: 'task-2',
    caseId: '1',
    title: 'Review Contract',
    description: 'Review and verify client representation contract',
    stage: 'intake',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-16T11:00:00Z',
    dueDate: '2025-10-20T17:00:00Z', // Future date for testing
    isStandard: true,
    templateId: 'template-intake',
    createdAt: '2025-01-16T10:00:00Z',
    updatedAt: '2025-01-16T11:00:00Z'
  },
  {
    _id: 'task-3',
    caseId: '1',
    title: '15 Day Case Review',
    description: 'Conduct comprehensive 15-day case review and assessment',
    stage: 'opening',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'attorney-1', name: 'Attorney', role: 'attorney' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-17T09:00:00Z',
    dueDate: '2025-01-30T17:00:00Z',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-17T09:00:00Z',
    updatedAt: '2025-01-17T09:00:00Z'
  },
  {
    _id: 'task-4',
    caseId: '1',
    title: 'AR',
    description: 'Prepare and send accident report documentation',
    stage: 'opening',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-17T09:00:00Z',
    dueDate: '2025-01-25T17:00:00Z',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-17T09:00:00Z',
    updatedAt: '2025-01-17T09:00:00Z'
  },
  {
    _id: 'task-5',
    caseId: '1',
    title: 'HI Cards',
    description: 'Prepare and send health insurance information cards',
    stage: 'opening',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-18T09:00:00Z',
    dueDate: '2025-01-25T17:00:00Z',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-18T09:00:00Z',
    updatedAt: '2025-01-18T09:00:00Z'
  },
  {
    _id: 'task-6',
    caseId: '1',
    title: 'HI Ltr',
    description: 'Prepare and send health insurance correspondence letter',
    stage: 'opening',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-18T09:00:00Z',
    dueDate: '2025-01-25T17:00:00Z',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-18T09:00:00Z',
    updatedAt: '2025-01-18T09:00:00Z'
  },
  {
    _id: 'task-7',
    caseId: '1',
    title: 'HI Subro',
    description: 'Handle health insurance subrogation requirements',
    stage: 'opening',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-18T09:00:00Z',
    dueDate: '2025-01-28T17:00:00Z',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-18T09:00:00Z',
    updatedAt: '2025-01-18T09:00:00Z'
  },
  {
    _id: 'task-8',
    caseId: '1',
    title: 'Initial Med Recs',
    description: 'Request and collect initial medical records from providers',
    stage: 'treating',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-01T09:00:00Z',
    dueDate: '2025-02-20T17:00:00Z',
    isStandard: true,
    templateId: 'template-treating',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z'
  },
  {
    _id: 'task-9',
    caseId: '1',
    title: 'Bill HI Ltr',
    description: 'Prepare and send billing letter to health insurance',
    stage: 'treating',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-01T09:00:00Z',
    dueDate: '2025-02-10T17:00:00Z',
    isStandard: true,
    templateId: 'template-treating',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z'
  },
  {
    _id: 'task-10',
    caseId: '1',
    title: 'PD Resolved',
    description: 'Confirm property damage claim resolution status',
    stage: 'treating',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-01T09:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    isStandard: true,
    templateId: 'template-treating',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z'
  },
  {
    _id: 'task-11',
    caseId: '1',
    title: '30 Day Call',
    description: 'Conduct 30-day case status call with client',
    stage: 'treating',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'attorney-1', name: 'Attorney', role: 'attorney' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-01T09:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    isStandard: true,
    templateId: 'template-treating',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z'
  },
  {
    _id: 'task-12',
    caseId: '1',
    title: 'LOR Liability',
    description: 'Prepare Letter of Representation for liability insurance',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-13',
    caseId: '1',
    title: 'LOR UM',
    description: 'Prepare Letter of Representation for underinsured motorist coverage',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-14',
    caseId: '1',
    title: 'Dec Page L',
    description: 'Prepare declaration page for liability coverage',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-12T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-15',
    caseId: '1',
    title: 'Dec Page UM',
    description: 'Prepare declaration page for UM coverage',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-12T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-16',
    caseId: '1',
    title: 'ACM',
    description: 'Prepare additional claims materials and documentation',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-17T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-17',
    caseId: '1',
    title: 'All Bills/Recs',
    description: 'Collect and organize all medical bills and records',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-20T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-18',
    caseId: '1',
    title: 'Draft Demand',
    description: 'Draft comprehensive settlement demand letter',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-25T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-19',
    caseId: '1',
    title: 'Send Liability Demand',
    description: 'Send completed demand package to liability insurance',
    stage: 'negotiation',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-20T09:00:00Z',
    dueDate: '2025-02-22T17:00:00Z',
    isStandard: true,
    templateId: 'template-negotiation',
    createdAt: '2025-02-20T09:00:00Z',
    updatedAt: '2025-02-20T09:00:00Z'
  },
  {
    _id: 'task-20',
    caseId: '1',
    title: 'Send UM Demand',
    description: 'Send completed demand package to UM carrier',
    stage: 'negotiation',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-20T09:00:00Z',
    dueDate: '2025-02-22T17:00:00Z',
    isStandard: true,
    templateId: 'template-negotiation',
    createdAt: '2025-02-20T09:00:00Z',
    updatedAt: '2025-02-20T09:00:00Z'
  },
  {
    _id: 'task-21',
    caseId: '1',
    title: 'Med Pay Demand',
    description: 'Prepare and send medical payments demand if applicable',
    stage: 'negotiation',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-20T09:00:00Z',
    dueDate: '2025-02-25T17:00:00Z',
    isStandard: true,
    templateId: 'template-negotiation',
    createdAt: '2025-02-20T09:00:00Z',
    updatedAt: '2025-02-20T09:00:00Z'
  },

  // Case 2 tasks (same set)
  {
    _id: 'task-22',
    caseId: '2',
    title: 'Initial Call',
    description: 'Conduct initial consultation with client to gather case details',
    stage: 'intake',
    status: 'pending',
    priority: 'urgent',
    assignedTo: { _id: 'attorney-1', name: 'Attorney', role: 'attorney' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-15T10:00:00Z',
    dueDate: '2025-10-15T17:00:00Z', // Future date for testing
    isStandard: true,
    templateId: 'template-intake',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-16T14:30:00Z'
  },
  {
    _id: 'task-23',
    caseId: '2',
    title: 'Review Contract',
    description: 'Review and verify client representation contract',
    stage: 'intake',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-16T11:00:00Z',
    dueDate: '2025-10-20T17:00:00Z', // Future date for testing
    isStandard: true,
    templateId: 'template-intake',
    createdAt: '2025-01-16T10:00:00Z',
    updatedAt: '2025-01-16T11:00:00Z'
  },
  {
    _id: 'task-24',
    caseId: '2',
    title: '15 Day Case Review',
    description: 'Conduct comprehensive 15-day case review and assessment',
    stage: 'opening',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'attorney-1', name: 'Attorney', role: 'attorney' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-17T09:00:00Z',
    dueDate: '2025-01-30T17:00:00Z',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-17T09:00:00Z',
    updatedAt: '2025-01-17T09:00:00Z'
  },
  {
    _id: 'task-25',
    caseId: '2',
    title: 'AR',
    description: 'Prepare and send accident report documentation',
    stage: 'opening',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-17T09:00:00Z',
    dueDate: '2025-01-25T17:00:00Z',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-17T09:00:00Z',
    updatedAt: '2025-01-17T09:00:00Z'
  },
  {
    _id: 'task-26',
    caseId: '2',
    title: 'HI Cards',
    description: 'Prepare and send health insurance information cards',
    stage: 'opening',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-18T09:00:00Z',
    dueDate: '2025-01-25T17:00:00Z',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-18T09:00:00Z',
    updatedAt: '2025-01-18T09:00:00Z'
  },
  {
    _id: 'task-27',
    caseId: '2',
    title: 'HI Ltr',
    description: 'Prepare and send health insurance correspondence letter',
    stage: 'opening',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-18T09:00:00Z',
    dueDate: '2025-01-25T17:00:00Z',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-18T09:00:00Z',
    updatedAt: '2025-01-18T09:00:00Z'
  },
  {
    _id: 'task-28',
    caseId: '2',
    title: 'HI Subro',
    description: 'Handle health insurance subrogation requirements',
    stage: 'opening',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-01-18T09:00:00Z',
    dueDate: '2025-01-28T17:00:00Z',
    isStandard: true,
    templateId: 'template-opening',
    createdAt: '2025-01-18T09:00:00Z',
    updatedAt: '2025-01-18T09:00:00Z'
  },
  {
    _id: 'task-29',
    caseId: '2',
    title: 'Initial Med Recs',
    description: 'Request and collect initial medical records from providers',
    stage: 'treating',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-01T09:00:00Z',
    dueDate: '2025-02-20T17:00:00Z',
    isStandard: true,
    templateId: 'template-treating',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z'
  },
  {
    _id: 'task-30',
    caseId: '2',
    title: 'Bill HI Ltr',
    description: 'Prepare and send billing letter to health insurance',
    stage: 'treating',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-01T09:00:00Z',
    dueDate: '2025-02-10T17:00:00Z',
    isStandard: true,
    templateId: 'template-treating',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z'
  },
  {
    _id: 'task-31',
    caseId: '2',
    title: 'PD Resolved',
    description: 'Confirm property damage claim resolution status',
    stage: 'treating',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-01T09:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    isStandard: true,
    templateId: 'template-treating',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z'
  },
  {
    _id: 'task-32',
    caseId: '2',
    title: '30 Day Call',
    description: 'Conduct 30-day case status call with client',
    stage: 'treating',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'attorney-1', name: 'Attorney', role: 'attorney' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-01T09:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    isStandard: true,
    templateId: 'template-treating',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z'
  },
  {
    _id: 'task-33',
    caseId: '2',
    title: 'LOR Liability',
    description: 'Prepare Letter of Representation for liability insurance',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-34',
    caseId: '2',
    title: 'LOR UM',
    description: 'Prepare Letter of Representation for underinsured motorist coverage',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-35',
    caseId: '2',
    title: 'Dec Page L',
    description: 'Prepare declaration page for liability coverage',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-12T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-36',
    caseId: '2',
    title: 'Dec Page UM',
    description: 'Prepare declaration page for UM coverage',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-12T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-37',
    caseId: '2',
    title: 'ACM',
    description: 'Prepare additional claims materials and documentation',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-17T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-38',
    caseId: '2',
    title: 'All Bills/Recs',
    description: 'Collect and organize all medical bills and records',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-20T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-39',
    caseId: '2',
    title: 'Draft Demand',
    description: 'Draft comprehensive settlement demand letter',
    stage: 'demandPrep',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-10T09:00:00Z',
    dueDate: '2025-02-25T17:00:00Z',
    isStandard: true,
    templateId: 'template-demand-prep',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z'
  },
  {
    _id: 'task-40',
    caseId: '2',
    title: 'Send Liability Demand',
    description: 'Send completed demand package to liability insurance',
    stage: 'negotiation',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-20T09:00:00Z',
    dueDate: '2025-02-22T17:00:00Z',
    isStandard: true,
    templateId: 'template-negotiation',
    createdAt: '2025-02-20T09:00:00Z',
    updatedAt: '2025-02-20T09:00:00Z'
  },
  {
    _id: 'task-41',
    caseId: '2',
    title: 'Send UM Demand',
    description: 'Send completed demand package to UM carrier',
    stage: 'negotiation',
    status: 'pending',
    priority: 'high',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-20T09:00:00Z',
    dueDate: '2025-02-22T17:00:00Z',
    isStandard: true,
    templateId: 'template-negotiation',
    createdAt: '2025-02-20T09:00:00Z',
    updatedAt: '2025-02-20T09:00:00Z'
  },
  {
    _id: 'task-42',
    caseId: '2',
    title: 'Med Pay Demand',
    description: 'Prepare and send medical payments demand if applicable',
    stage: 'negotiation',
    status: 'pending',
    priority: 'medium',
    assignedTo: { _id: 'casemanager-1', name: 'Case Manager', role: 'caseManager' },
    assignedBy: 'admin-1',
    assignedAt: '2025-02-20T09:00:00Z',
    dueDate: '2025-02-25T17:00:00Z',
    isStandard: true,
    templateId: 'template-negotiation',
    createdAt: '2025-02-20T09:00:00Z',
    updatedAt: '2025-02-20T09:00:00Z'
  }
];

// Add tasks for remaining cases (3-18)
const additionalMockTasks: Task[] = [];

// Generate tasks for cases 3-18
for (let caseId = 3; caseId <= 18; caseId++) {
  const caseTasks = mockTasks.slice(0, 21).map((task, index) => ({
    ...task,
    _id: `task-${caseId}-${index + 1}`,
    caseId: caseId.toString(),
    status: 'pending' as const,
    // Adjust due dates to be relative to current date
    dueDate: task.dueDate ? new Date(Date.now() + (index * 7 * 24 * 60 * 60 * 1000)).toISOString() : undefined,
    createdAt: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
    updatedAt: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString()
  }));
  additionalMockTasks.push(...caseTasks);
}

const allMockTasks = [...mockTasks, ...additionalMockTasks];

export function useTasks(caseId?: string) {
  const { currentUser, isAdmin, isAttorney, isCaseManager } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  // Initialize tasks from localStorage or mock data
  useEffect(() => {
    if (!initializedRef.current) {
      console.log('useTasks initializing from localStorage or mock data');
      setLoading(true);

      // Try to load from localStorage first
      const savedTasks = localStorage.getItem('pmtest-tasks');
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          console.log('useTasks loaded tasks from localStorage:', parsedTasks.length);
          setTasks(parsedTasks);
        } catch (error) {
          console.error('useTasks failed to parse saved tasks:', error);
          setTasks(allMockTasks);
        }
      } else {
        console.log('useTasks initializing from mock data');
        setTasks(allMockTasks);
      }

      initializedRef.current = true;
      setLoading(false);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (initializedRef.current && tasks.length > 0) {
      console.log('useTasks saving tasks to localStorage:', tasks.length);
      localStorage.setItem('pmtest-tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Compute filtered tasks without modifying the main tasks state
  const filteredTasks = useMemo(() => {
    if (!initializedRef.current || tasks.length === 0) return [];

    console.log('=== useTasks FILTERING DEBUG ===');
    console.log('useTasks called with caseId:', caseId);
    console.log('useTasks currentUser:', currentUser);
    console.log('useTasks currentUser._id:', currentUser?._id);
    console.log('useTasks currentUser.role:', currentUser?.role);
    console.log('useTasks currentUser.name:', currentUser?.name);
    console.log('useTasks isAdmin:', isAdmin);
    console.log('useTasks isAttorney:', isAttorney);
    console.log('useTasks isCaseManager:', isCaseManager);

    let filtered = tasks;

    if (caseId) {
      // Filter tasks for specific case
      filtered = tasks.filter(task => task.caseId === caseId);
      console.log('useTasks all tasks:', tasks.length);
      console.log('useTasks filtered caseTasks:', filtered.length);
      console.log('useTasks caseTasks details:', filtered.map(t => ({ id: t._id, title: t.title, caseId: t.caseId })));

      // Apply role-based filtering for specific case
      if (!isAdmin) {
        console.log('useTasks applying role-based filtering for non-admin');
        // Non-admin users only see tasks assigned to them or their role
        filtered = filtered.filter(task => {
          // Show tasks assigned to current user
          if (task.assignedTo?._id === currentUser?._id) {
            console.log('useTasks task assigned to current user:', task.title);
            return true;
          }

          // Show tasks assigned to user's role (for unassigned tasks)
          if (!task.assignedTo && task.stage) {
            const template = standardTaskTemplates.find(t => t._id === task.templateId);
            if (template) {
              const taskTemplate = template.tasks.find(t => t.title === task.title);
              if (taskTemplate) {
                if (isAttorney && taskTemplate.assignedToRole === 'attorney') {
                  console.log('useTasks task matches attorney role:', task.title);
                  return true;
                }
                if (isCaseManager && taskTemplate.assignedToRole === 'caseManager') {
                  console.log('useTasks task matches caseManager role:', task.title);
                  return true;
                }
              }
            }
          }

          console.log('useTasks task filtered out:', task.title);
          return false;
        });
      } else {
        console.log('useTasks admin user - showing all tasks without filtering');
      }

      console.log('useTasks final tasks count:', filtered.length);
    } else {
      // When no caseId is provided, return all tasks (for overview/dashboard)
      // Do NOT apply role-based filtering for overview - show all tasks
      console.log('useTasks no caseId provided, returning all tasks for overview');
      console.log('All tasks available:', tasks.length);
      console.log('Tasks details:', tasks.map(t => ({ id: t._id, title: t.title, caseId: t.caseId, status: t.status })));
      console.log('useTasks final all tasks count:', tasks.length);
      filtered = tasks;
    }

    return filtered;
  }, [caseId, currentUser, isAdmin, isAttorney, isCaseManager, tasks]);

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

  const clearTaskStorage = () => {
    localStorage.removeItem('pmtest-tasks');
    setTasks(allMockTasks);
    console.log('useTasks cleared localStorage and reset to mock data');
  };

  return {
    tasks: filteredTasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    completeTask,
    clearTaskStorage
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