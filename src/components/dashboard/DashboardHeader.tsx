import { Button } from '../ui/Button';
import { RoleSwitcher } from '../ui/RoleSwitcher';

interface DashboardHeaderProps {
  onAddCase: () => void;
  showAddForm: boolean;
}

export function DashboardHeader({ onAddCase, showAddForm }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Practice Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your personal injury cases</p>
          </div>
          <div className="flex items-center space-x-6">
            <RoleSwitcher />
            <Button onClick={onAddCase}>
              {showAddForm ? 'Cancel' : '+ Add Case'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}