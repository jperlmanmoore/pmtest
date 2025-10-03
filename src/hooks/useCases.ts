'use client';

import { useState, useEffect } from 'react';
import { Case, Client, CaseFormData } from '../types';

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setCases([
        {
          _id: '1',
          caseNumber: '000001',
          clientId: { _id: '1', name: 'John Doe' },
          title: 'Car Accident - Main St',
          description: 'Rear-end collision at Main Street intersection',
          stage: 'intake',
          dateOfLoss: '2024-01-15',
          dateOfIncident: '2024-01-15',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2024-03-15',
          assignedAttorney: { _id: 'attorney-1', name: 'Sarah Johnson' },
          statuteOfLimitations: {
            solDate: '2026-01-15',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '2',
          caseNumber: '000002',
          clientId: { _id: '2', name: 'Jane Smith' },
          title: 'Car Accident - Main St (Passenger)',
          description: 'Passenger in the same Main Street collision',
          stage: 'treating',
          dateOfLoss: '2024-01-15',
          dateOfIncident: '2024-01-15',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2024-03-15',
          parentCaseId: '1', // Child case linked to case #1
          assignedAttorney: { _id: 'attorney-1', name: 'Sarah Johnson' },
          statuteOfLimitations: {
            solDate: '2026-01-15',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '3',
          caseNumber: '000003',
          clientId: { _id: '3', name: 'Bob Johnson' },
          title: 'Car Accident - Highway I-95',
          description: 'Multi-vehicle accident on I-95 during rush hour',
          stage: 'settlement',
          dateOfLoss: '2024-03-10',
          dateOfIncident: '2024-03-10',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2024-05-10',
          assignedAttorney: { _id: 'attorney-2', name: 'Michael Chen' },
          showInChecklist: true, // Allow this settlement case to show in checklist
          statuteOfLimitations: {
            solDate: '2026-03-10',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '4',
          caseNumber: '000004',
          clientId: { _id: '4', name: 'Alice Brown' },
          title: 'Car Accident - Highway I-95 (Witness)',
          description: 'Witness to the I-95 multi-vehicle accident',
          stage: 'intake',
          dateOfLoss: '2024-03-10',
          dateOfIncident: '2024-03-10',
          anteLitemRequired: false,
          parentCaseId: '3', // Child case linked to case #3
          statuteOfLimitations: {
            solDate: '2026-03-10',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '5',
          caseNumber: '000005',
          clientId: { _id: '5', name: 'Charlie Wilson' },
          title: 'Slip and Fall - Grocery Store',
          description: 'Client slipped on wet floor in produce section',
          stage: 'treating',
          dateOfLoss: '2024-02-20',
          dateOfIncident: '2024-02-20',
          anteLitemRequired: false,
          assignedAttorney: { _id: 'attorney-3', name: 'Emily Rodriguez' },
          statuteOfLimitations: {
            solDate: '2026-02-20',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '6',
          caseNumber: '000006',
          clientId: { _id: '6', name: 'Diana Prince' },
          title: 'Apartment - Mold Exposure',
          description: 'Severe mold exposure in apartment unit causing respiratory issues',
          stage: 'negotiation',
          dateOfLoss: '2024-06-08',
          dateOfIncident: '2024-06-08',
          anteLitemRequired: false,
          assignedAttorney: { _id: 'attorney-2', name: 'Michael Chen' },
          showInChecklist: false, // This negotiation case is not shown in checklist by default
          statuteOfLimitations: {
            solDate: '2026-06-08',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '7',
          caseNumber: '000007',
          clientId: { _id: '7', name: 'Edward Norton' },
          title: 'Sexual Assault - Workplace',
          description: 'Sexual assault incident at workplace requiring immediate medical attention',
          stage: 'treating',
          dateOfLoss: '2024-07-22',
          dateOfIncident: '2024-07-22',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2024-09-22',
          assignedAttorney: { _id: 'attorney-1', name: 'Sarah Johnson' },
          statuteOfLimitations: {
            solDate: '2026-07-22',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '8',
          caseNumber: '000008',
          clientId: { _id: '8', name: 'Fiona Green' },
          title: 'Dog Bite - Park Incident',
          description: 'Severe dog bite while walking in public park',
          stage: 'intake',
          dateOfLoss: '2024-08-14',
          dateOfIncident: '2024-08-14',
          anteLitemRequired: false,
          statuteOfLimitations: {
            solDate: '2026-08-14',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '9',
          caseNumber: '000009',
          clientId: { _id: '9', name: 'George Miller' },
          title: 'Apartment - Maintenance Neglect',
          description: 'Broken elevator caused fall and injury in apartment building',
          stage: 'demandPrep',
          dateOfLoss: '2024-09-03',
          dateOfIncident: '2024-09-03',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2024-11-03',
          assignedAttorney: { _id: 'attorney-3', name: 'Emily Rodriguez' },
          statuteOfLimitations: {
            solDate: '2026-09-03',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '11',
          caseNumber: '000010',
          clientId: { _id: '11', name: 'Frank Miller' },
          title: 'Bus Accident - Downtown Route',
          description: 'City bus accident at downtown intersection affecting multiple passengers',
          stage: 'demandPrep',
          dateOfLoss: '2024-11-15',
          dateOfIncident: '2024-11-15',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2025-01-15',
          statuteOfLimitations: {
            solDate: '2026-11-15',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '12',
          caseNumber: '000011',
          clientId: { _id: '12', name: 'Grace Lee' },
          title: 'Bus Accident - Downtown Route (Passenger)',
          description: 'Passenger injured in downtown bus accident - whiplash and back injury',
          stage: 'treating',
          dateOfLoss: '2024-11-15',
          dateOfIncident: '2024-11-15',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2025-01-15',
          parentCaseId: '11',
          statuteOfLimitations: {
            solDate: '2026-11-15',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '13',
          caseNumber: '000012',
          clientId: { _id: '13', name: 'Henry Clark' },
          title: 'Bus Accident - Downtown Route (Passenger)',
          description: 'Passenger injured in downtown bus accident - broken arm and concussion',
          stage: 'negotiation',
          dateOfLoss: '2024-11-15',
          dateOfIncident: '2024-11-15',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2025-01-15',
          parentCaseId: '11',
          showInChecklist: true, // Allow this negotiation case to show in checklist
          statuteOfLimitations: {
            solDate: '2026-11-15',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '14',
          caseNumber: '000013',
          clientId: { _id: '14', name: 'Ivy Chen' },
          title: 'Bus Accident - Downtown Route (Passenger)',
          description: 'Passenger injured in downtown bus accident - knee injury requiring surgery',
          stage: 'settlement',
          dateOfLoss: '2024-11-15',
          dateOfIncident: '2024-11-15',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2025-01-15',
          parentCaseId: '11',
          showInChecklist: false, // This settlement case is not shown in checklist by default
          statuteOfLimitations: {
            solDate: '2026-11-15',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '15',
          caseNumber: '000014',
          clientId: { _id: '15', name: 'Jack Taylor' },
          title: 'Bus Accident - Downtown Route (Witness)',
          description: 'Witness to downtown bus accident - emotional trauma',
          stage: 'intake',
          dateOfLoss: '2024-11-15',
          dateOfIncident: '2024-11-15',
          anteLitemRequired: false,
          parentCaseId: '11',
          statuteOfLimitations: {
            solDate: '2026-11-15',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '16',
          caseNumber: '000015',
          clientId: { _id: '16', name: 'Karen White' },
          title: 'Workplace Chemical Spill',
          description: 'Chemical spill in office building affecting multiple employees',
          stage: 'demandPrep',
          dateOfLoss: '2024-12-01',
          dateOfIncident: '2024-12-01',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2025-02-01',
          statuteOfLimitations: {
            solDate: '2026-12-01',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '17',
          caseNumber: '000016',
          clientId: { _id: '17', name: 'Larry Brown' },
          title: 'Workplace Chemical Spill (Employee)',
          description: 'Employee exposed to chemical spill - respiratory issues and skin burns',
          stage: 'treating',
          dateOfLoss: '2024-12-01',
          dateOfIncident: '2024-12-01',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2025-02-01',
          parentCaseId: '16',
          statuteOfLimitations: {
            solDate: '2026-12-01',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
        {
          _id: '18',
          caseNumber: '000017',
          clientId: { _id: '18', name: 'Mary Johnson' },
          title: 'Workplace Chemical Spill (Employee)',
          description: 'Employee exposed to chemical spill - eye irritation and allergic reaction',
          stage: 'negotiation',
          dateOfLoss: '2024-12-01',
          dateOfIncident: '2024-12-01',
          anteLitemRequired: true,
          anteLitemAgency: 'State Medical Board',
          anteLitemDeadline: '2025-02-01',
          parentCaseId: '16',
          showInChecklist: true, // Allow this negotiation case to show in checklist
          statuteOfLimitations: {
            solDate: '2026-12-01',
            solType: 'personalInjury',
            solState: 'Florida',
            solStatus: 'active',
            solWarningDays: 90,
            solBasis: 'Florida Statute §95.11 - Personal Injury'
          }
        },
      ]);

      setClients([
        { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0101' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102' },
        { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0103' },
        { _id: '4', name: 'Alice Brown', email: 'alice@example.com', phone: '555-0104' },
        { _id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', phone: '555-0105' },
        { _id: '6', name: 'Diana Prince', email: 'diana@example.com', phone: '555-0106' },
        { _id: '7', name: 'Edward Norton', email: 'edward@example.com', phone: '555-0107' },
        { _id: '8', name: 'Fiona Green', email: 'fiona@example.com', phone: '555-0108' },
        { _id: '9', name: 'George Miller', email: 'george@example.com', phone: '555-0109' },
        { _id: '10', name: 'Helen Davis', email: 'helen@example.com', phone: '555-0110' },
        { _id: '11', name: 'Frank Miller', email: 'frank@example.com', phone: '555-0111' },
        { _id: '12', name: 'Grace Lee', email: 'grace@example.com', phone: '555-0112' },
        { _id: '13', name: 'Henry Clark', email: 'henry@example.com', phone: '555-0113' },
        { _id: '14', name: 'Ivy Chen', email: 'ivy@example.com', phone: '555-0114' },
        { _id: '15', name: 'Jack Taylor', email: 'jack@example.com', phone: '555-0115' },
        { _id: '16', name: 'Karen White', email: 'karen@example.com', phone: '555-0116' },
        { _id: '17', name: 'Larry Brown', email: 'larry@example.com', phone: '555-0117' },
        { _id: '18', name: 'Mary Johnson', email: 'mary@example.com', phone: '555-0118' },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const addCase = (caseData: CaseFormData) => {
    const client = clients.find(c => c._id === caseData.clientId);
    if (!client) return;

    // Generate next case number
    const existingNumbers = cases.map(c => parseInt(c.caseNumber)).filter(n => !isNaN(n));
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    const caseNumber = nextNumber.toString().padStart(6, '0');

    const newCase: Case = {
      _id: Date.now().toString(),
      caseNumber,
      clientId: { _id: client._id, name: client.name },
      title: caseData.title,
      description: caseData.description,
      stage: caseData.stage as Case['stage'],
      dateOfLoss: caseData.dateOfLoss,
      anteLitemRequired: caseData.anteLitemRequired,
      anteLitemAgency: caseData.anteLitemAgency,
      anteLitemDeadline: caseData.anteLitemDeadline,
      parentCaseId: caseData.parentCaseId || undefined,

      // Initial Call Data
      narrative: caseData.narrative,
      dateOfIncident: caseData.dateOfIncident,
      placeOfIncident: caseData.placeOfIncident,
      otherParties: caseData.otherParties,
      incidentReportNumber: caseData.incidentReportNumber,
      reportingAgency: caseData.reportingAgency,

      // Insurance Information
      liabilityInsurance: caseData.liabilityInsurance,
      personalInsurance: caseData.personalInsurance,
      otherInsurance: caseData.otherInsurance,
      healthInsurance: caseData.healthInsurance,

      // Medical Information
      medicalProviders: caseData.medicalProviders,

      // Financial Information
      damages: caseData.damages,
      liens: caseData.liens,

      // Statute of Limitations
      statuteOfLimitations: caseData.statuteOfLimitations,
    };

    setCases(prev => [...prev, newCase]);
  };

  const updateCase = (id: string, caseData: CaseFormData) => {
    const client = clients.find(c => c._id === caseData.clientId);
    if (!client) return;

    setCases(prev => prev.map(c =>
      c._id === id
        ? {
            ...c,
            title: caseData.title,
            description: caseData.description,
            stage: caseData.stage as Case['stage'],
            dateOfLoss: caseData.dateOfLoss,
            anteLitemRequired: caseData.anteLitemRequired,
            anteLitemAgency: caseData.anteLitemAgency,
            anteLitemDeadline: caseData.anteLitemDeadline,
            parentCaseId: caseData.parentCaseId || undefined,
            clientId: { _id: client._id, name: client.name },

            // Initial Call Data
            narrative: caseData.narrative,
            dateOfIncident: caseData.dateOfIncident,
            placeOfIncident: caseData.placeOfIncident,
            otherParties: caseData.otherParties,
            incidentReportNumber: caseData.incidentReportNumber,
            reportingAgency: caseData.reportingAgency,

            // Insurance Information
            liabilityInsurance: caseData.liabilityInsurance,
            personalInsurance: caseData.personalInsurance,
            otherInsurance: caseData.otherInsurance,
            healthInsurance: caseData.healthInsurance,

            // Medical Information
            medicalProviders: caseData.medicalProviders,

            // Financial Information
            damages: caseData.damages,
            liens: caseData.liens,

            // Statute of Limitations
            statuteOfLimitations: caseData.statuteOfLimitations,
          }
        : c
    ));
  };

  const deleteCase = (id: string) => {
    setCases(prev => prev.filter(c => c._id !== id));
  };

  const toggleChecklistVisibility = (id: string) => {
    setCases(prev => prev.map(c =>
      c._id === id
        ? { ...c, showInChecklist: !c.showInChecklist }
        : c
    ));
  };

  // Filter out witness cases from main case list
  const getMainCases = () => {
    return cases.filter(c => !c.title.toLowerCase().includes('witness'));
  };

  // Get witness cases for a specific parent case
  const getWitnessesForCase = (parentCaseId: string) => {
    return cases.filter(c => c.parentCaseId === parentCaseId && c.title.toLowerCase().includes('witness'));
  };

  return {
    cases,
    clients,
    loading,
    addCase,
    updateCase,
    deleteCase,
    toggleChecklistVisibility,
    getMainCases,
    getWitnessesForCase,
  };
}