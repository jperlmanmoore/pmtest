'use client';

console.log('TaskContext.tsx file loaded - BEFORE ANY IMPORTS');

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Task } from '../types';
import { standardTaskTemplates } from '../data/taskTemplates';

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
console.log('allMockTasks created with', allMockTasks.length, 'tasks');

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  assignTask: (taskId: string, userId: string, userName: string, userRole: 'attorney' | 'caseManager') => Promise<void>;
  completeTask: (taskId: string, userId: string) => Promise<void>;
  clearTaskStorage: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);
console.log('TaskContext created successfully');

export function TaskProvider({ children }: { children: React.ReactNode }) {
  console.log('TASK_PROVIDER_FUNCTION_CALLED - COMPONENT FUNCTION STARTED - THIS SHOULD APPEAR');
  console.log('=== TaskProvider COMPONENT START ===');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);
  console.log('TaskProvider initializedRef initial value:', initializedRef.current);

  console.log('TaskProvider: About to initialize tasks');

  // Monitor tasks state changes
  useEffect(() => {
    console.log('TASK_STATE_CHANGED:', tasks.length, 'tasks');
    if (tasks.length > 0) {
      console.log('First task:', tasks[0]);
      console.log('TASK_STATE_UPDATE: Tasks are now available in context');
    } else {
      console.log('TASK_STATE_UPDATE: No tasks in context yet');
    }
  }, [tasks]);

  // Initialize tasks from localStorage or mock data
  useEffect(() => {
    console.log('TASK_PROVIDER_USE_EFFECT_STARTED');
    console.log('=== TaskProvider INITIALIZATION useEffect RUNNING ===');
    console.log('initializedRef.current:', initializedRef.current);

    if (!initializedRef.current) {
      console.log('TaskProvider initializing from localStorage or mock data');
      setLoading(true);

      // Try to load from localStorage first
      let savedTasks = null;
      try {
        savedTasks = localStorage.getItem('pmtest-tasks');
        console.log('TaskProvider localStorage access successful, value:', savedTasks);
      } catch (storageError) {
        console.error('TaskProvider localStorage access failed:', storageError);
      }
      
      console.log('TaskProvider localStorage key "pmtest-tasks" value:', savedTasks);

      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          console.log('TaskProvider JSON.parse successful, loaded tasks:', parsedTasks.length);
          console.log('TaskProvider first few tasks:', parsedTasks.slice(0, 3).map((t: Task) => ({ id: t._id, title: t.title, status: t.status, caseId: t.caseId })));
          console.log('TaskProvider calling setTasks with parsed tasks');
          setTasks(parsedTasks);
          console.log('TaskProvider setTasks called with parsed tasks, should now have:', parsedTasks.length, 'tasks');
          console.log('TaskProvider IMMEDIATE CHECK - tasks state should update now');
        } catch (parseError) {
          console.error('TaskProvider JSON.parse failed:', parseError);
          console.log('TaskProvider falling back to mock data due to parse error');
          setTasks(allMockTasks);
          console.log('TaskProvider setTasks called with mock data, should now have:', allMockTasks.length, 'tasks');
          console.log('TaskProvider IMMEDIATE CHECK - mock tasks state should update now');
        }
      } else {
        console.log('TaskProvider no saved tasks found, using mock data');
        console.log('TaskProvider allMockTasks length:', allMockTasks.length);
        console.log('TaskProvider calling setTasks with mock data');
        setTasks(allMockTasks);
        console.log('TaskProvider setTasks called with mock data, should now have:', allMockTasks.length, 'tasks');
        console.log('TaskProvider IMMEDIATE CHECK - mock tasks state should update now');
      }

      initializedRef.current = true;
      setLoading(false);
      console.log('TaskProvider initialization complete');
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (initializedRef.current && tasks.length > 0) {
      console.log('TaskProvider saving tasks to localStorage:', tasks.length);
      console.log('TaskProvider tasks to save:', tasks.map(t => ({ id: t._id, title: t.title, status: t.status, caseId: t.caseId })));
      try {
        localStorage.setItem('pmtest-tasks', JSON.stringify(tasks));
        console.log('TaskProvider successfully saved to localStorage');
      } catch (error) {
        console.error('TaskProvider failed to save to localStorage:', error);
      }
    }
  }, [tasks]);

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
    console.log('UPDATE_TASK_FUNCTION_STARTED');
    console.log('=== TaskProvider updateTask CALLED ===');
    console.log('TaskProvider updateTask taskId:', taskId);
    console.log('TaskProvider updateTask updates:', updates);
    console.log('TaskProvider updateTask current tasks count:', tasks.length);

    // Add a simple console.log to verify this function is being called
    console.log('UPDATE_TASK_FUNCTION_EXECUTING');

    try {

      const updatedTasks = tasks.map(task =>
        task._id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );

      // Check if task was actually found and updated
      const taskWasUpdated = updatedTasks.some(task => task._id === taskId && task.updatedAt !== tasks.find(t => t._id === taskId)?.updatedAt);

      if (taskWasUpdated) {
        console.log('TaskProvider updating tasks state');
        setTasks(updatedTasks);
        console.log('TaskProvider task updated successfully');
      } else {
        console.warn('TaskProvider task not found or not updated:', taskId);
      }
    } catch (err) {
      console.error('TaskProvider failed to update task:', err);
      setError('Failed to update task');
      throw err;
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
    console.log('TaskProvider cleared localStorage and reset to mock data');
  };

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    completeTask,
    clearTaskStorage
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(caseId?: string) {
  const context = useContext(TaskContext);
  // const { currentUser, isAdmin, isAttorney, isCaseManager } = useUser();

  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }

  // Compute filtered tasks without modifying the main tasks state
  const filteredTasks = useMemo(() => {
    if (!context.tasks.length) {
      console.log('useTasks: no tasks available');
      return [];
    }

    console.log('=== useTasks FILTERING DEBUG ===');
    console.log('useTasks called with caseId:', caseId);
    // console.log('useTasks currentUser:', currentUser);
    // console.log('useTasks isAdmin:', isAdmin);
    console.log('useTasks total tasks in context:', context.tasks.length);
    console.log('useTasks task statuses:', context.tasks.map(t => ({ id: t._id, title: t.title, status: t.status, caseId: t.caseId })));

    let filtered = context.tasks;

    if (caseId) {
      // Filter tasks for specific case
      filtered = context.tasks.filter(task => task.caseId === caseId);
      console.log('useTasks filtered for caseId:', caseId, 'found:', filtered.length);
      console.log('useTasks caseTasks details:', filtered.map(t => ({ id: t._id, title: t.title, status: t.status })));

      // Apply role-based filtering for specific case
      // if (!isAdmin) {
        console.log('useTasks applying role-based filtering for non-admin');
        // Non-admin users only see tasks assigned to them or their role
        filtered = filtered.filter(task => {
          // Show tasks assigned to current user
          // if (task.assignedTo?._id === currentUser?._id) {
          //   console.log('useTasks task assigned to current user:', task.title);
          //   return true;
          // }

          // Show tasks assigned to user's role (for unassigned tasks)
          if (!task.assignedTo && task.stage) {
            const template = standardTaskTemplates.find(t => t._id === task.templateId);
            if (template) {
              const taskTemplate = template.tasks.find(t => t.title === task.title);
              if (taskTemplate) {
                // if (isAttorney && taskTemplate.assignedToRole === 'attorney') {
                //   console.log('useTasks task matches attorney role:', task.title);
                //   return true;
                // }
                // if (isCaseManager && taskTemplate.assignedToRole === 'caseManager') {
                //   console.log('useTasks task matches caseManager role:', task.title);
                //   return true;
                // }
                console.log('useTasks task matches role:', task.title);
                return true;
              }
            }
          }

          console.log('useTasks task filtered out:', task.title);
          return false;
        });
      // } else {
        console.log('useTasks admin user - showing all tasks without filtering');
      // }

      console.log('useTasks final filtered tasks count:', filtered.length);
    } else {
      // When no caseId is provided, return all tasks (for overview/dashboard)
      console.log('useTasks no caseId provided, returning all tasks for overview');
      filtered = context.tasks;
    }

    return filtered;
  }, [caseId, /* currentUser, isAdmin, isAttorney, isCaseManager, */ context.tasks]);

  console.log('useTasks returning object with updateTask:', typeof context.updateTask);

  return {
    tasks: filteredTasks,
    loading: context.loading,
    error: context.error,
    createTask: context.createTask,
    updateTask: context.updateTask,
    deleteTask: context.deleteTask,
    assignTask: context.assignTask,
    completeTask: context.completeTask,
    clearTaskStorage: context.clearTaskStorage
  };
}