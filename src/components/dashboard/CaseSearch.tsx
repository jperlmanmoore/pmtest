'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Case } from '../../types';

interface CaseSearchProps {
  cases: Case[];
  onCaseSelect?: (caseItem: Case) => void;
  placeholder?: string;
}

export function CaseSearch({ cases, onCaseSelect, placeholder = "Search by case number or client name..." }: CaseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredCases = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return cases.filter(caseItem =>
      caseItem.caseNumber.toLowerCase().includes(query) ||
      caseItem.clientId.name.toLowerCase().includes(query) ||
      caseItem.title.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to 10 results for performance
  }, [cases, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.length > 0);
  };

  const handleCaseClick = (caseItem: Case) => {
    if (onCaseSelect) {
      onCaseSelect(caseItem);
    }
    setSearchQuery('');
    setShowResults(false);
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      intake: 'bg-blue-100 text-blue-800',
      opening: 'bg-yellow-100 text-yellow-800',
      treating: 'bg-green-100 text-green-800',
      demandPrep: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      settlement: 'bg-indigo-100 text-indigo-800',
      resolution: 'bg-teal-100 text-teal-800',
      probate: 'bg-pink-100 text-pink-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowResults(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            title="Clear search"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {filteredCases.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredCases.map((caseItem) => (
                  <div
                    key={caseItem._id}
                    onClick={() => handleCaseClick(caseItem)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">{caseItem.caseNumber}</span>
                          <Badge className={getStageColor(caseItem.stage)}>
                            {caseItem.stage}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {caseItem.clientId.name} - {caseItem.title}
                        </p>
                        {caseItem.statuteOfLimitations && (
                          <p className="text-xs text-gray-500 mt-1">
                            SOL: {new Date(caseItem.statuteOfLimitations.solDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="secondary">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No cases found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}