// Shared TypeScript interfaces for the application

export interface Insurance {
  company: string;
  policyHolder: string;
  policyNumber: string;
  claimNumber?: string;
  adjuster?: string;
  coverage?: string;
  contactInfo?: string;
  notes?: string;
}

export interface MedicalProvider {
  name: string;
  specialty?: string;
  contactInfo?: string;
  facility?: string;
  notes?: string;
}

export interface Lien {
  type: string;
  amount: number;
  holder: string;
  priority?: number;
  notes?: string;
}

export interface Damages {
  propertyDamage?: number;
  medicalExpenses?: number;
  lostWages?: number;
  painAndSuffering?: number;
  otherDamages?: number;
  totalEstimated?: number;
  notes?: string;
}

export interface StatuteOfLimitations {
  solDate: string; // Calculated SOL deadline
  solType: 'personalInjury' | 'propertyDamage' | 'medicalMalpractice' | 'wrongfulDeath' | 'contract' | 'other';
  solState: string; // State where SOL applies
  solBasis?: string; // Legal basis for calculation
  solNotes?: string;
  solWarningDays: number; // Days before deadline to show warnings (default 90)
  solStatus: 'active' | 'tolled' | 'expired' | 'preserved';
  tollingEvents?: string[]; // Events that may toll the SOL
}

export interface Case {
  _id: string;
  caseNumber: string; // 6-digit case number (e.g., "000001")
  clientId: { _id: string; name: string };
  title: string;
  description: string;
  stage: 'intake' | 'opening' | 'treating' | 'demandPrep' | 'negotiation' | 'settlement' | 'resolution' | 'probate' | 'closed';
  dateOfLoss: string;
  anteLitemRequired: boolean;
  anteLitemAgency?: string;
  anteLitemDeadline?: string;
  parentCaseId?: string; // For linking related cases from the same incident

  // Checklist visibility control
  showInChecklist?: boolean; // For negotiation/settlement cases - allows them to appear in the task checklist

  // Attorney Assignment
  assignedAttorney?: { _id: string; name: string };

  // Task Management
  tasks?: Task[];

  // Close Request Workflow
  closeRequested?: boolean;
  closeRequestedBy?: string; // User ID who requested the close
  closeRequestedAt?: string; // Timestamp of close request
  closeRequestReason?: string; // Reason for closing the case

  // Initial Call Data
  narrative?: string;
  dateOfIncident?: string;
  placeOfIncident?: string;
  otherParties?: string[];
  incidentReportNumber?: string;
  reportingAgency?: string;

  // Insurance Information
  liabilityInsurance?: Insurance[];
  personalInsurance?: Insurance[];
  otherInsurance?: Insurance[];
  healthInsurance?: Insurance;

  // Medical Information
  medicalProviders?: MedicalProvider[];

  // Financial Information
  damages?: Damages;
  liens?: Lien[];

  // Statute of Limitations
  statuteOfLimitations?: StatuteOfLimitations;

  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  dateOfBirth?: string;
  ssn?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'intake' | 'caseManager' | 'accountant' | 'attorney';
  subgroup?: 'manager' | 'qualityControl'; // Admin subgroups
  createdAt?: string;
  updatedAt?: string;
}

export interface CaseFormData {
  clientId: string;
  caseNumber: string; // 6-digit case number (e.g., "000001")
  title: string;
  description: string;
  stage: string;
  dateOfLoss: string;
  anteLitemRequired: boolean;
  anteLitemAgency: string;
  anteLitemDeadline: string;
  parentCaseId?: string; // For linking related cases from the same incident

  // Checklist visibility control
  showInChecklist?: boolean; // For negotiation/settlement cases - allows them to appear in the task checklist

  // Attorney Assignment
  assignedAttorney?: string;

  // Close Request Workflow
  closeRequested?: boolean;
  closeRequestedBy?: string;
  closeRequestedAt?: string;
  closeRequestReason?: string;

  // Initial Call Data
  narrative?: string;
  dateOfIncident?: string;
  placeOfIncident?: string;
  otherParties?: string[];
  incidentReportNumber?: string;
  reportingAgency?: string;

  // Insurance Information
  liabilityInsurance?: Insurance[];
  personalInsurance?: Insurance[];
  otherInsurance?: Insurance[];
  healthInsurance?: Insurance;

  // Medical Information
  medicalProviders?: MedicalProvider[];

  // Financial Information
  damages?: Damages;
  liens?: Lien[];

  // Statute of Limitations
  statuteOfLimitations?: StatuteOfLimitations;
}

export interface Task {
  _id: string;
  caseId: string;
  title: string;
  description?: string;
  stage: 'intake' | 'opening' | 'treating' | 'demandPrep' | 'negotiation' | 'settlement' | 'resolution' | 'probate' | 'litigation' | 'resign' | 'terminate' | 'closed';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    _id: string;
    name: string;
    role: 'attorney' | 'caseManager';
  };
  assignedBy: string; // User ID who assigned the task
  assignedAt: string;
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
  isStandard: boolean; // Whether this is from a standard template
  templateId?: string; // Reference to the template if it's a standard task
  notes?: string;
  dependencies?: string[]; // Task IDs that must be completed first
  createdAt: string;
  updatedAt: string;
}

export interface TaskTemplate {
  _id: string;
  name: string;
  description?: string;
  stage: 'intake' | 'opening' | 'treating' | 'demandPrep' | 'negotiation' | 'settlement' | 'resolution' | 'probate' | 'litigation' | 'resign' | 'terminate' | 'closed';
  tasks: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimatedDays?: number; // Days from case creation to complete
    dependencies?: string[]; // Task template IDs that must be completed first
    assignedToRole?: 'attorney' | 'caseManager'; // Default role assignment
  }[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAssignment {
  taskId: string;
  userId: string;
  userName: string;
  userRole: 'attorney' | 'caseManager';
  assignedAt: string;
  assignedBy: string;
}