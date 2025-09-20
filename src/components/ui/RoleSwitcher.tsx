'use client';

import { useUser } from '../../contexts/UserContext';

export function RoleSwitcher() {
  const { currentTestRole, switchTestRole, currentUser } = useUser();

  const roles = [
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' },
    { value: 'manager', label: 'Manager', color: 'bg-orange-100 text-orange-800' },
    { value: 'qualityControl', label: 'Quality Control', color: 'bg-pink-100 text-pink-800' },
    { value: 'intake', label: 'Intake', color: 'bg-blue-100 text-blue-800' },
    { value: 'caseManager', label: 'Case Manager', color: 'bg-green-100 text-green-800' },
    { value: 'accountant', label: 'Accountant', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'attorney', label: 'Attorney', color: 'bg-purple-100 text-purple-800' },
  ] as const;

  const currentRoleInfo = roles.find(role => role.value === currentTestRole);

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-900">Testing as:</span>
      <select
        value={currentTestRole}
        onChange={(e) => switchTestRole(e.target.value as typeof currentTestRole)}
        className="px-3 py-1 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 role-dropdown"
        title="Select user role for testing"
        aria-label="Select user role for testing"
      >
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
      {currentUser && (
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${currentRoleInfo?.color}`}>
          {currentUser.name}
        </div>
      )}
    </div>
  );
}