'use client';

import { useState } from 'react';
import { Contact } from '../types';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ContactForm } from './forms/ContactForm';

interface ContactListProps {
  contacts: Contact[];
  caseId: string;
  onAddContact: (contactData: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateContact: (contactId: string, updates: Partial<Contact>) => void;
  onDeleteContact: (contactId: string) => void;
  onLinkContactToCase: (contactId: string, caseId: string) => void;
  onUnlinkContactFromCase: (contactId: string, caseId: string) => void;
  onSearchGlobalContacts: (query: string, excludeCaseId?: string) => Contact[];
}

const CONTACT_TYPE_LABELS = {
  insurance_company: 'Insurance Companies',
  insurance_adjuster: 'Insurance Adjusters',
  medical_provider: 'Medical Providers',
  health_insurance: 'Health Insurance',
  subrogation_company: 'Subrogation Companies',
  pre_settlement_loan: 'Pre-Settlement Loan Companies'
} as const;

const CONTACT_TYPE_ICONS = {
  insurance_company: '🏢',
  insurance_adjuster: '👤',
  medical_provider: '🏥',
  health_insurance: '🩺',
  subrogation_company: '⚖️',
  pre_settlement_loan: '💰'
} as const;

export function ContactList({
  contacts,
  caseId,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onLinkContactToCase,
  onUnlinkContactFromCase,
  onSearchGlobalContacts
}: ContactListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);

  // Group contacts by type
  const groupedContacts = contacts.reduce((acc, contact) => {
    if (!acc[contact.type]) {
      acc[contact.type] = [];
    }
    acc[contact.type].push(contact);
    return acc;
  }, {} as Record<Contact['type'], Contact[]>);

  const handleSaveContact = (contactData: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (editingContact) {
      onUpdateContact(editingContact._id, contactData);
      setEditingContact(null);
    } else {
      onAddContact(contactData);
      setShowForm(false);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      onDeleteContact(contactId);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const handleSearchContacts = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = onSearchGlobalContacts(query, caseId);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleImportContact = (contact: Contact) => {
    onLinkContactToCase(contact._id, caseId);
    setSearchQuery('');
    setSearchResults([]);
    setShowImport(false);
  };

  const handleUnlinkContact = (contactId: string) => {
    if (confirm('Are you sure you want to remove this contact from this case? The contact will still exist globally.')) {
      onUnlinkContactFromCase(contactId, caseId);
    }
  };

  if (showForm) {
    return (
      <ContactForm
        contact={editingContact || undefined}
        caseId={caseId}
        onSave={handleSaveContact}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add and Import Buttons */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Case Contacts</h3>
        <div className="flex gap-2">
          <Button onClick={() => setShowImport(!showImport)} variant="secondary">
            Import Existing
          </Button>
          <Button onClick={() => setShowForm(true)}>
            Add New
          </Button>
        </div>
      </div>

      {/* Import/Search Section */}
      {showImport && (
        <Card>
          <CardHeader>
            <h4 className="text-md font-semibold text-slate-900">Import Existing Contact</h4>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Global Contacts
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchContacts(e.target.value)}
                  placeholder="Search by name, company, email, or phone..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-slate-700">Search Results:</h5>
                  {searchResults.map(contact => (
                    <div key={contact._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-900">{contact.name}</div>
                        {contact.company && <div className="text-sm text-slate-600">{contact.company}</div>}
                        <div className="text-sm text-slate-500">{contact.phone}</div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleImportContact(contact)}
                      >
                        Import
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {searchQuery.length > 2 && searchResults.length === 0 && (
                <p className="text-sm text-slate-500">No matching contacts found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Groups */}
      {Object.keys(groupedContacts).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-slate-400 text-lg mb-2">No contacts added yet</div>
            <p className="text-slate-500 mb-4">Add insurance companies, adjusters, medical providers, and other contacts for this case.</p>
            <Button onClick={() => setShowForm(true)}>
              Add First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedContacts).map(([type, typeContacts]) => (
          <Card key={type}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="text-lg">{CONTACT_TYPE_ICONS[type as keyof typeof CONTACT_TYPE_ICONS]}</span>
                <h4 className="text-md font-semibold text-slate-900">
                  {CONTACT_TYPE_LABELS[type as keyof typeof CONTACT_TYPE_LABELS]}
                </h4>
                <Badge variant="default" className="ml-2">
                  {typeContacts.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {typeContacts.map(contact => (
                  <div key={contact._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-slate-900">{contact.name}</h5>
                          {contact.isPrimary && (
                            <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                              Primary
                            </Badge>
                          )}
                          {contact.isGlobal && (
                            <Badge variant="success" className="text-xs">
                              Global
                            </Badge>
                          )}
                        </div>

                        {contact.company && (
                          <p className="text-sm text-slate-600 mb-1">{contact.company}</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 mb-2">
                          {contact.phone && (
                            <div>📞 {contact.phone}</div>
                          )}
                          {contact.email && (
                            <div>✉️ {contact.email}</div>
                          )}
                          {contact.fax && (
                            <div>📠 {contact.fax}</div>
                          )}
                        </div>

                        {(contact.address.street || contact.address.city) && (
                          <div className="text-sm text-slate-600 mb-2">
                            📍 {[
                              contact.address.street,
                              contact.address.city,
                              contact.address.state,
                              contact.address.zipCode
                            ].filter(Boolean).join(', ')}
                          </div>
                        )}

                        {contact.notes && (
                          <div className="text-sm text-slate-600">
                            📝 {contact.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditContact(contact)}
                        >
                          Edit
                        </Button>
                        {contact.isGlobal ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUnlinkContact(contact._id)}
                          >
                            Unlink
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteContact(contact._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}