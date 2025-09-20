import { TaskTemplate } from '../types';

// Standard task templates for each case stage
export const standardTaskTemplates: TaskTemplate[] = [
  {
    _id: 'template-intake',
    name: 'Intake Stage Tasks',
    description: 'Standard tasks for the intake stage of a case',
    stage: 'intake',
    tasks: [
      {
        title: 'Initial Client Consultation',
        description: 'Conduct initial consultation with client to gather case details and establish rapport',
        priority: 'high',
        estimatedDays: 3,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Create Case File',
        description: 'Set up complete case file with all initial documentation and client information',
        priority: 'high',
        estimatedDays: 1,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Verify Client Information',
        description: 'Confirm all client contact information, address, and personal details',
        priority: 'medium',
        estimatedDays: 2,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Document Incident Details',
        description: 'Record complete details of the incident including date, time, location, and witnesses',
        priority: 'high',
        estimatedDays: 2,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Initial Medical Assessment',
        description: 'Assess immediate medical needs and connect client with appropriate care providers',
        priority: 'urgent',
        estimatedDays: 1,
        assignedToRole: 'caseManager'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-opening',
    name: 'Opening Stage Tasks',
    description: 'Standard tasks for opening and organizing a new case',
    stage: 'opening',
    tasks: [
      {
        title: 'Attorney Assignment',
        description: 'Assign appropriate attorney based on case type and attorney availability',
        priority: 'high',
        estimatedDays: 2,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Case Strategy Development',
        description: 'Develop initial case strategy and litigation plan',
        priority: 'high',
        estimatedDays: 5,
        assignedToRole: 'attorney'
      },
      {
        title: 'Insurance Investigation',
        description: 'Investigate all applicable insurance policies and coverage',
        priority: 'medium',
        estimatedDays: 7,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Preliminary Damages Assessment',
        description: 'Conduct initial assessment of potential damages and case value',
        priority: 'medium',
        estimatedDays: 10,
        assignedToRole: 'attorney'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-treating',
    name: 'Treating Stage Tasks',
    description: 'Standard tasks for the medical treatment and documentation phase',
    stage: 'treating',
    tasks: [
      {
        title: 'Medical Records Collection',
        description: 'Request and collect all relevant medical records from treating providers',
        priority: 'high',
        estimatedDays: 30,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Medical Provider Interviews',
        description: 'Interview treating physicians and medical providers for case details',
        priority: 'medium',
        estimatedDays: 45,
        assignedToRole: 'attorney'
      },
      {
        title: 'Medical Chronology Creation',
        description: 'Create detailed chronology of medical treatment and recovery',
        priority: 'medium',
        estimatedDays: 60,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Medical Expert Consultation',
        description: 'Consult with medical experts regarding injury causation and prognosis',
        priority: 'medium',
        estimatedDays: 90,
        assignedToRole: 'attorney'
      },
      {
        title: 'Lost Wages Documentation',
        description: 'Document and calculate lost wages and earning capacity',
        priority: 'medium',
        estimatedDays: 45,
        assignedToRole: 'caseManager'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-demand-prep',
    name: 'Demand Preparation Tasks',
    description: 'Standard tasks for preparing and submitting settlement demand',
    stage: 'demandPrep',
    tasks: [
      {
        title: 'Demand Letter Drafting',
        description: 'Draft comprehensive settlement demand letter with all supporting documentation',
        priority: 'high',
        estimatedDays: 14,
        assignedToRole: 'attorney'
      },
      {
        title: 'Medical Summary Preparation',
        description: 'Prepare comprehensive medical summary for demand package',
        priority: 'high',
        estimatedDays: 10,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Damages Calculation',
        description: 'Calculate and document all economic and non-economic damages',
        priority: 'high',
        estimatedDays: 7,
        assignedToRole: 'attorney'
      },
      {
        title: 'Supporting Documentation Assembly',
        description: 'Assemble all supporting documents, photos, and evidence for demand',
        priority: 'medium',
        estimatedDays: 10,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Demand Review and Approval',
        description: 'Review demand package and obtain necessary approvals',
        priority: 'high',
        estimatedDays: 3,
        assignedToRole: 'attorney'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-negotiation',
    name: 'Negotiation Stage Tasks',
    description: 'Standard tasks for negotiating settlement with insurance company',
    stage: 'negotiation',
    tasks: [
      {
        title: 'Initial Settlement Discussions',
        description: 'Conduct initial settlement discussions and gauge insurance company position',
        priority: 'high',
        estimatedDays: 7,
        assignedToRole: 'attorney'
      },
      {
        title: 'Counter-Offer Analysis',
        description: 'Analyze insurance company counter-offers and prepare responses',
        priority: 'high',
        estimatedDays: 14,
        assignedToRole: 'attorney'
      },
      {
        title: 'Mediation Preparation',
        description: 'Prepare for potential mediation if negotiations stall',
        priority: 'medium',
        estimatedDays: 21,
        assignedToRole: 'attorney'
      },
      {
        title: 'Client Settlement Consultation',
        description: 'Consult with client regarding settlement offers and recommendations',
        priority: 'high',
        estimatedDays: 3,
        assignedToRole: 'attorney'
      },
      {
        title: 'Settlement Documentation',
        description: 'Prepare all necessary settlement documentation and release forms',
        priority: 'medium',
        estimatedDays: 5,
        assignedToRole: 'caseManager'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-settlement',
    name: 'Settlement Stage Tasks',
    description: 'Standard tasks for finalizing and processing settlement',
    stage: 'settlement',
    tasks: [
      {
        title: 'Settlement Agreement Review',
        description: 'Review and finalize settlement agreement terms',
        priority: 'high',
        estimatedDays: 3,
        assignedToRole: 'attorney'
      },
      {
        title: 'Client Settlement Approval',
        description: 'Obtain client approval and signature on settlement documents',
        priority: 'urgent',
        estimatedDays: 2,
        assignedToRole: 'attorney'
      },
      {
        title: 'Settlement Funds Processing',
        description: 'Process and disburse settlement funds according to agreement',
        priority: 'high',
        estimatedDays: 5,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Lien Resolution',
        description: 'Resolve all medical and other liens from settlement proceeds',
        priority: 'high',
        estimatedDays: 10,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Case Closure Documentation',
        description: 'Complete all case closure documentation and file retention',
        priority: 'medium',
        estimatedDays: 7,
        assignedToRole: 'caseManager'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-resolution',
    name: 'Resolution Stage Tasks',
    description: 'Standard tasks for case resolution and final documentation',
    stage: 'resolution',
    tasks: [
      {
        title: 'Final Documentation Review',
        description: 'Review all final case documentation for completeness',
        priority: 'medium',
        estimatedDays: 5,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Client Final Consultation',
        description: 'Conduct final consultation with client regarding case outcome',
        priority: 'medium',
        estimatedDays: 2,
        assignedToRole: 'attorney'
      },
      {
        title: 'File Archival',
        description: 'Archive case file according to retention policies',
        priority: 'low',
        estimatedDays: 3,
        assignedToRole: 'caseManager'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-probate',
    name: 'Probate Stage Tasks',
    description: 'Standard tasks for probate proceedings',
    stage: 'probate',
    tasks: [
      {
        title: 'Estate Inventory',
        description: 'Complete inventory of decedent estate assets and liabilities',
        priority: 'high',
        estimatedDays: 30,
        assignedToRole: 'attorney'
      },
      {
        title: 'Will and Trust Review',
        description: 'Review will and trust documents for validity and execution',
        priority: 'high',
        estimatedDays: 14,
        assignedToRole: 'attorney'
      },
      {
        title: 'Beneficiary Notifications',
        description: 'Notify all beneficiaries and interested parties of probate proceedings',
        priority: 'medium',
        estimatedDays: 7,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Probate Filing',
        description: 'File necessary probate documents with appropriate court',
        priority: 'high',
        estimatedDays: 10,
        assignedToRole: 'attorney'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-litigation',
    name: 'Litigation Stage Tasks',
    description: 'Standard tasks for litigation proceedings',
    stage: 'litigation',
    tasks: [
      {
        title: 'Complaint Drafting',
        description: 'Draft and file formal complaint with court',
        priority: 'high',
        estimatedDays: 14,
        assignedToRole: 'attorney'
      },
      {
        title: 'Discovery Preparation',
        description: 'Prepare for and conduct discovery phase of litigation',
        priority: 'high',
        estimatedDays: 60,
        assignedToRole: 'attorney'
      },
      {
        title: 'Witness Preparation',
        description: 'Prepare witnesses for deposition and trial testimony',
        priority: 'medium',
        estimatedDays: 30,
        assignedToRole: 'attorney'
      },
      {
        title: 'Trial Preparation',
        description: 'Prepare case for trial including exhibits and witness lists',
        priority: 'high',
        estimatedDays: 45,
        assignedToRole: 'attorney'
      },
      {
        title: 'Court Filing Management',
        description: 'Manage all court filings and deadlines throughout litigation',
        priority: 'medium',
        estimatedDays: 180,
        assignedToRole: 'caseManager'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-resign',
    name: 'Resignation Stage Tasks',
    description: 'Standard tasks for attorney resignation from case',
    stage: 'resign',
    tasks: [
      {
        title: 'Client Notification',
        description: 'Notify client of attorney resignation and explain next steps',
        priority: 'urgent',
        estimatedDays: 1,
        assignedToRole: 'attorney'
      },
      {
        title: 'File Transfer Preparation',
        description: 'Prepare case file for transfer to new attorney',
        priority: 'high',
        estimatedDays: 3,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Court Notification',
        description: 'Notify court of attorney change if applicable',
        priority: 'medium',
        estimatedDays: 2,
        assignedToRole: 'attorney'
      },
      {
        title: 'New Attorney Transition',
        description: 'Facilitate smooth transition to new attorney',
        priority: 'high',
        estimatedDays: 5,
        assignedToRole: 'caseManager'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-terminate',
    name: 'Termination Stage Tasks',
    description: 'Standard tasks for case termination',
    stage: 'terminate',
    tasks: [
      {
        title: 'Termination Documentation',
        description: 'Document reasons for case termination and client notification',
        priority: 'high',
        estimatedDays: 2,
        assignedToRole: 'attorney'
      },
      {
        title: 'Client Final Consultation',
        description: 'Conduct final consultation explaining termination decision',
        priority: 'medium',
        estimatedDays: 1,
        assignedToRole: 'attorney'
      },
      {
        title: 'File Archival',
        description: 'Archive terminated case file according to retention policies',
        priority: 'medium',
        estimatedDays: 3,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Outstanding Matter Resolution',
        description: 'Resolve any outstanding matters or loose ends',
        priority: 'medium',
        estimatedDays: 7,
        assignedToRole: 'caseManager'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'template-closed',
    name: 'Closed Stage Tasks',
    description: 'Standard tasks for case closure and final documentation',
    stage: 'closed',
    tasks: [
      {
        title: 'Final Documentation Review',
        description: 'Conduct final review of all case documentation',
        priority: 'medium',
        estimatedDays: 5,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Client Satisfaction Survey',
        description: 'Send client satisfaction survey and follow up',
        priority: 'low',
        estimatedDays: 7,
        assignedToRole: 'caseManager'
      },
      {
        title: 'File Retention Setup',
        description: 'Set up file retention schedule according to legal requirements',
        priority: 'low',
        estimatedDays: 1,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Case Metrics Recording',
        description: 'Record final case metrics for reporting and analysis',
        priority: 'low',
        estimatedDays: 2,
        assignedToRole: 'caseManager'
      }
    ],
    isActive: true,
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

// Helper function to get template for a specific stage
export function getTemplateForStage(stage: TaskTemplate['stage']): TaskTemplate | undefined {
  return standardTaskTemplates.find(template => template.stage === stage && template.isActive);
}

// Helper function to get all active templates
export function getActiveTemplates(): TaskTemplate[] {
  return standardTaskTemplates.filter(template => template.isActive);
}