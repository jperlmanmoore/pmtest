'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  isAttorney: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // For now, we'll mock an attorney user. In a real app, this would come from authentication
  const [currentUser, setCurrentUser] = useState<User | null>({
    _id: '1',
    email: 'attorney@example.com',
    name: 'John Attorney',
    role: 'attorney', // Change this to 'admin' to test admin functionality
  });

  const isAdmin = currentUser?.role === 'admin';
  const isAttorney = currentUser?.role === 'attorney';

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isAdmin, isAttorney }}>
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