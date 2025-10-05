'use client';

import { useState, useEffect, useCallback } from 'react';
import { Contact } from '../types';

// Mock data for contacts - in a real app, this would come from an API
const mockContacts: Contact[] = [
  {
    _id: 'contact-1',
    type: 'insurance_company',
    name: 'State Farm Insurance',
    address: {
      street: '123 Insurance Blvd',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    phone: '(555) 123-4567',
    fax: '(555) 123-4568',
    email: 'claims@statefarm.com',
    isPrimary: true,
    isGlobal: true,
    linkedCases: ['1'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'contact-2',
    type: 'insurance_adjuster',
    name: 'John Smith',
    company: 'State Farm Insurance',
    address: {
      street: '123 Insurance Blvd',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    phone: '(555) 987-6543',
    email: 'john.smith@statefarm.com',
    isPrimary: true,
    isGlobal: true,
    linkedCases: ['1'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: 'contact-3',
    type: 'medical_provider',
    name: 'Springfield General Hospital',
    address: {
      street: '456 Medical Center Dr',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    },
    phone: '(555) 555-0123',
    fax: '(555) 555-0124',
    isPrimary: true,
    isGlobal: true,
    linkedCases: ['1'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

export function useContacts(caseId?: string) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  // Load contacts from localStorage or use mock data as fallback
  const loadContacts = useCallback((targetCaseId?: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      try {
        const storedContacts = localStorage.getItem('pmtest_contacts');
        let allContacts: Contact[] = [];

        if (storedContacts) {
          allContacts = JSON.parse(storedContacts);
        } else {
          // Use mock data as initial data
          allContacts = [...mockContacts];
          localStorage.setItem('pmtest_contacts', JSON.stringify(allContacts));
        }

        if (targetCaseId) {
          setContacts(allContacts.filter(c => c.linkedCases.includes(targetCaseId)));
        } else {
          setContacts(allContacts);
        }
      } catch (error) {
        console.error('Error loading contacts from localStorage:', error);
        // Fallback to mock data
        if (targetCaseId) {
          setContacts(mockContacts.filter(c => c.linkedCases.includes(targetCaseId)));
        } else {
          setContacts(mockContacts);
        }
      }
      setLoading(false);
    }, 100);
  }, []);

  // Get contacts for a specific case
  const getContactsForCase = useCallback((targetCaseId: string) => {
    return contacts.filter(c => c.linkedCases.includes(targetCaseId));
  }, [contacts]);

  // Add a new contact
  const addContact = useCallback((contactData: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>) => {
    const newContact: Contact = {
      ...contactData,
      _id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setContacts(prev => {
      const updatedContacts = [...prev, newContact];
      try {
        localStorage.setItem('pmtest_contacts', JSON.stringify(updatedContacts));
      } catch (error) {
        console.error('Error saving contacts to localStorage:', error);
      }
      return updatedContacts;
    });
    return newContact;
  }, []);

  // Update an existing contact
  const updateContact = useCallback((contactId: string, updates: Partial<Contact>) => {
    setContacts(prev => {
      const updatedContacts = prev.map(contact =>
        contact._id === contactId
          ? { ...contact, ...updates, updatedAt: new Date().toISOString() }
          : contact
      );
      try {
        localStorage.setItem('pmtest_contacts', JSON.stringify(updatedContacts));
      } catch (error) {
        console.error('Error saving contacts to localStorage:', error);
      }
      return updatedContacts;
    });
  }, []);

  // Delete a contact
  const deleteContact = useCallback((contactId: string) => {
    setContacts(prev => {
      const updatedContacts = prev.filter(contact => contact._id !== contactId);
      try {
        localStorage.setItem('pmtest_contacts', JSON.stringify(updatedContacts));
      } catch (error) {
        console.error('Error saving contacts to localStorage:', error);
      }
      return updatedContacts;
    });
  }, []);

  // Get contacts by type for a case
  const getContactsByType = useCallback((targetCaseId: string, type: Contact['type']) => {
    return contacts.filter(c => c.linkedCases.includes(targetCaseId) && c.type === type);
  }, [contacts]);

  // Get primary contact for a type
  const getPrimaryContact = useCallback((targetCaseId: string, type: Contact['type']) => {
    return contacts.find(c => c.linkedCases.includes(targetCaseId) && c.type === type && c.isPrimary);
  }, [contacts]);

  // Link a contact to a case
  const linkContactToCase = useCallback((contactId: string, targetCaseId: string) => {
    setContacts(prev => {
      const updatedContacts = prev.map(contact =>
        contact._id === contactId
          ? {
              ...contact,
              linkedCases: contact.linkedCases.includes(targetCaseId)
                ? contact.linkedCases
                : [...contact.linkedCases, targetCaseId],
              updatedAt: new Date().toISOString()
            }
          : contact
      );
      try {
        localStorage.setItem('pmtest_contacts', JSON.stringify(updatedContacts));
      } catch (error) {
        console.error('Error saving contacts to localStorage:', error);
      }
      return updatedContacts;
    });
  }, []);

  // Unlink a contact from a case
  const unlinkContactFromCase = useCallback((contactId: string, targetCaseId: string) => {
    setContacts(prev => {
      const updatedContacts = prev.map(contact =>
        contact._id === contactId
          ? {
              ...contact,
              linkedCases: contact.linkedCases.filter(id => id !== targetCaseId),
              updatedAt: new Date().toISOString()
            }
          : contact
      );
      try {
        localStorage.setItem('pmtest_contacts', JSON.stringify(updatedContacts));
      } catch (error) {
        console.error('Error saving contacts to localStorage:', error);
      }
      return updatedContacts;
    });
  }, []);

  // Search global contacts (not linked to current case)
  const searchGlobalContacts = useCallback((query: string, excludeCaseId?: string) => {
    const searchTerm = query.toLowerCase();
    return contacts.filter(contact =>
      contact.isGlobal &&
      (excludeCaseId ? !contact.linkedCases.includes(excludeCaseId) : true) &&
      (
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.company?.toLowerCase().includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm) ||
        contact.phone.includes(searchTerm)
      )
    );
  }, [contacts]);

  useEffect(() => {
    if (caseId) {
      loadContacts(caseId);
    } else {
      loadContacts();
    }
  }, [caseId, loadContacts]);

  return {
    contacts,
    loading,
    loadContacts,
    getContactsForCase,
    getContactsByType,
    getPrimaryContact,
    addContact,
    updateContact,
    deleteContact,
    linkContactToCase,
    unlinkContactFromCase,
    searchGlobalContacts
  };
}