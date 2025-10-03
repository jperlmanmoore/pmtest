'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  isAttorney: boolean;
  isCaseManager: boolean;
  isAccountant: boolean;
  isIntake: boolean;
  isManager: boolean;
  isQualityControl: boolean;
  switchTestRole: (role: 'admin' | 'manager' | 'qualityControl' | 'intake' | 'caseManager' | 'accountant' | 'attorney') => void;
  currentTestRole: 'admin' | 'manager' | 'qualityControl' | 'intake' | 'caseManager' | 'accountant' | 'attorney';
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Test users for development
const testUsers: Record<string, User> = {
  admin: {
    _id: 'admin-1',
    email: 'admin@test.com',
    name: 'Admin User',
    role: 'admin',
  },
  manager: {
    _id: 'manager-1',
    email: 'manager@test.com',
    name: 'Manager',
    role: 'admin',
    subgroup: 'manager',
  },
  qualityControl: {
    _id: 'qc-1',
    email: 'qc@test.com',
    name: 'Quality Control',
    role: 'admin',
    subgroup: 'qualityControl',
  },
  intake: {
    _id: 'intake-1',
    email: 'intake@test.com',
    name: 'Intake Specialist',
    role: 'intake',
  },
  caseManager: {
    _id: 'casemanager-1',
    email: 'casemanager@test.com',
    name: 'Case Manager',
    role: 'caseManager',
  },
  accountant: {
    _id: 'accountant-1',
    email: 'accountant@test.com',
    name: 'Accountant',
    role: 'accountant',
  },
  attorney: {
    _id: 'attorney-1',
    email: 'attorney@test.com',
    name: 'Attorney',
    role: 'attorney',
  },
};

export function UserProvider({ children }: { children: ReactNode }) {

  const [currentTestRole, setCurrentTestRole] = useState<'admin' | 'manager' | 'qualityControl' | 'intake' | 'caseManager' | 'accountant' | 'attorney'>(() => {
    // Initialize role safely for SSR
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('testUserRole') as 'admin' | 'manager' | 'qualityControl' | 'intake' | 'caseManager' | 'accountant' | 'attorney';
      if (savedRole && testUsers[savedRole]) {
        return savedRole;
      }
    }
    return 'admin';
  });

  // Get current user based on test role
  const currentUser = testUsers[currentTestRole];

  // Role checking functions
  const isAdmin = currentUser?.role === 'admin';
  const isAttorney = currentUser?.role === 'attorney';
  const isCaseManager = currentUser?.role === 'caseManager';
  const isAccountant = currentUser?.role === 'accountant';
  const isIntake = currentUser?.role === 'intake';
  const isManager = currentUser?.role === 'admin' && currentUser?.subgroup === 'manager';
  const isQualityControl = currentUser?.role === 'admin' && currentUser?.subgroup === 'qualityControl';

  // Function to switch test role
  const switchTestRole = (role: 'admin' | 'manager' | 'qualityControl' | 'intake' | 'caseManager' | 'accountant' | 'attorney') => {
    console.log('UserContext: Switching role from', currentTestRole, 'to', role);
    setCurrentTestRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('testUserRole', role);
    }
    console.log('UserContext: Role switched to', role);
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser: () => {}, // Not used in test mode
      isAdmin,
      isAttorney,
      isCaseManager,
      isAccountant,
      isIntake,
      isManager,
      isQualityControl,
      switchTestRole,
      currentTestRole,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}