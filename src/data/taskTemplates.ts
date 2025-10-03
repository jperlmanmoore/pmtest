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
        title: 'Initial Call',
        description: 'Conduct initial consultation with client to gather case details',
        priority: 'urgent',
        estimatedDays: 1,
        assignedToRole: 'attorney'
      },
      {
        title: 'Initial Call Assistant',
        description: 'Assist with initial client consultation and documentation',
        priority: 'high',
        estimatedDays: 1,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Review Contract',
        description: 'Review and verify client representation contract',
        priority: 'high',
        estimatedDays: 2,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Create Case File',
        description: 'Set up complete case file with all initial documentation',
        priority: 'high',
        estimatedDays: 1,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Verify Client Information',
        description: 'Confirm all client contact information and personal details',
        priority: 'medium',
        estimatedDays: 2,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Document Incident Details',
        description: 'Record complete details of the incident including date, time, location',
        priority: 'high',
        estimatedDays: 2,
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
        title: '15 Day Case Review',
        description: 'Conduct comprehensive 15-day case review and assessment',
        priority: 'high',
        estimatedDays: 15,
        assignedToRole: 'attorney'
      },
      {
        title: 'Attorney Assignment',
        description: 'Assign appropriate attorney based on case type and availability',
        priority: 'high',
        estimatedDays: 2,
        assignedToRole: 'caseManager'
      },
      {
        title: 'AR',
        description: 'Prepare and send accident report documentation',
        priority: 'medium',
        estimatedDays: 5,
        assignedToRole: 'caseManager'
      },
      {
        title: 'HI Cards',
        description: 'Prepare and send health insurance information cards',
        priority: 'medium',
        estimatedDays: 3,
        assignedToRole: 'caseManager'
      },
      {
        title: 'HI Ltr',
        description: 'Prepare and send health insurance correspondence letter',
        priority: 'medium',
        estimatedDays: 3,
        assignedToRole: 'caseManager'
      },
      {
        title: 'HI Subro',
        description: 'Handle health insurance subrogation requirements',
        priority: 'medium',
        estimatedDays: 7,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Insurance Investigation',
        description: 'Investigate all applicable insurance policies and coverage',
        priority: 'medium',
        estimatedDays: 7,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Case Strategy Development',
        description: 'Develop initial case strategy and litigation plan',
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
    _id: 'template-treating',
    name: 'Treating Stage Tasks',
    description: 'Standard tasks for the medical treatment and documentation phase',
    stage: 'treating',
    tasks: [
      {
        title: '30 Day Call',
        description: 'Conduct 30-day case status call with client',
        priority: 'medium',
        estimatedDays: 30,
        assignedToRole: 'attorney'
      },
      {
        title: 'Initial Med Recs',
        description: 'Request and collect initial medical records from providers',
        priority: 'high',
        estimatedDays: 14,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Bill HI Ltr',
        description: 'Prepare and send billing letter to health insurance',
        priority: 'medium',
        estimatedDays: 5,
        assignedToRole: 'caseManager'
      },
      {
        title: 'PD Resolved',
        description: 'Confirm property damage claim resolution status',
        priority: 'medium',
        estimatedDays: 21,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Damage Pictures',
        description: 'Collect and organize property damage photographs',
        priority: 'medium',
        estimatedDays: 14,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Injury Pictures',
        description: 'Collect and organize injury documentation photographs',
        priority: 'medium',
        estimatedDays: 14,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Medical Records Collection',
        description: 'Request and collect all relevant medical records from providers',
        priority: 'high',
        estimatedDays: 30,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Medical Chronology Creation',
        description: 'Create detailed chronology of medical treatment and recovery',
        priority: 'medium',
        estimatedDays: 21,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Lost Wages Documentation',
        description: 'Document and calculate lost wages and earning capacity',
        priority: 'medium',
        estimatedDays: 21,
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
        title: 'Demand Authority',
        description: 'Obtain demand authority and settlement parameters from client',
        priority: 'high',
        estimatedDays: 7,
        assignedToRole: 'attorney'
      },
      {
        title: 'LOR Liability',
        description: 'Prepare Letter of Representation for liability insurance',
        priority: 'high',
        estimatedDays: 5,
        assignedToRole: 'caseManager'
      },
      {
        title: 'LOR UM',
        description: 'Prepare Letter of Representation for underinsured motorist coverage',
        priority: 'high',
        estimatedDays: 5,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Dec Page L',
        description: 'Prepare declaration page for liability coverage',
        priority: 'medium',
        estimatedDays: 3,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Dec Page UM',
        description: 'Prepare declaration page for UM coverage',
        priority: 'medium',
        estimatedDays: 3,
        assignedToRole: 'caseManager'
      },
      {
        title: 'ACM',
        description: 'Prepare additional claims materials and documentation',
        priority: 'medium',
        estimatedDays: 7,
        assignedToRole: 'caseManager'
      },
      {
        title: 'All Bills/Recs',
        description: 'Collect and organize all medical bills and records',
        priority: 'high',
        estimatedDays: 14,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Draft Demand',
        description: 'Draft comprehensive settlement demand letter',
        priority: 'high',
        estimatedDays: 10,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Demand Letter Drafting',
        description: 'Finalize and review settlement demand letter with attorney',
        priority: 'high',
        estimatedDays: 5,
        assignedToRole: 'attorney'
      },
      {
        title: 'Send Liability Demand',
        description: 'Send completed demand package to liability insurance',
        priority: 'high',
        estimatedDays: 2,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Send UM Demand',
        description: 'Send completed demand package to UM carrier',
        priority: 'high',
        estimatedDays: 2,
        assignedToRole: 'caseManager'
      },
      {
        title: 'Med Pay Demand',
        description: 'Prepare and send medical payments demand if applicable',
        priority: 'medium',
        estimatedDays: 5,
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
        description: 'Assemble all supporting documents, photos, and evidence',
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
    _id: 'template-negotiation',
    name: 'Negotiation Stage Tasks',
    description: 'Standard tasks for negotiating settlement with insurance company',
    stage: 'negotiation',
    tasks: [
      {
        title: 'Initial Offer',
        description: 'Receive and review initial settlement offer from insurance',
        priority: 'high',
        estimatedDays: 14,
        assignedToRole: 'attorney'
      },
      {
        title: 'Update Client Re Initial Offer',
        description: 'Update client regarding initial settlement offer and recommendations',
        priority: 'high',
        estimatedDays: 3,
        assignedToRole: 'attorney'
      },
      {
        title: 'Follow Up on Negotiation',
        description: 'Conduct ongoing negotiation and follow-up with insurance company',
        priority: 'high',
        estimatedDays: 21,
        assignedToRole: 'attorney'
      },
      {
        title: 'Initial Settlement Discussions',
        description: 'Conduct initial settlement discussions and gauge insurance position',
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
        title: '30-Day/Closing Letter HI',
        description: 'Prepare and send 30-day closing letter to health insurance',
        priority: 'medium',
        estimatedDays: 5,
        assignedToRole: 'attorney'
      },
      {
        title: 'Reductions',
        description: 'Handle any settlement reductions or adjustments',
        priority: 'medium',
        estimatedDays: 7,
        assignedToRole: 'attorney'
      },
      {
        title: 'Bankruptcy?',
        description: 'Check for any bankruptcy filings that may affect settlement',
        priority: 'high',
        estimatedDays: 3,
        assignedToRole: 'attorney'
      },
      {
        title: 'Prep Settlement Statement',
        description: 'Prepare comprehensive settlement statement for client review',
        priority: 'high',
        estimatedDays: 5,
        assignedToRole: 'attorney'
      },
      {
        title: 'Send Settlement Statement to CL',
        description: 'Send settlement statement to client for review and approval',
        priority: 'high',
        estimatedDays: 2,
        assignedToRole: 'attorney'
      },
      {
        title: 'Receive Settlement Statement',
        description: 'Receive signed settlement statement from client',
        priority: 'high',
        estimatedDays: 7,
        assignedToRole: 'attorney'
      },
      {
        title: 'Check for Liens',
        description: 'Conduct thorough lien search and resolution',
        priority: 'high',
        estimatedDays: 10,
        assignedToRole: 'attorney'
      },
      {
        title: 'Releases',
        description: 'Prepare and obtain all necessary release forms',
        priority: 'high',
        estimatedDays: 5,
        assignedToRole: 'attorney'
      },
      {
        title: 'Receive Check',
        description: 'Receive settlement check from insurance company',
        priority: 'high',
        estimatedDays: 14,
        assignedToRole: 'attorney'
      },
      {
        title: 'Disburse Checks',
        description: 'Process and disburse settlement funds according to agreement',
        priority: 'urgent',
        estimatedDays: 3,
        assignedToRole: 'attorney'
      },
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