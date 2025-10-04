'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

// Mock data for package tracking
const mockPackages = [
  {
    id: '1',
    trackingNumber: '9400111899223345',
    carrier: 'USPS',
    caseName: 'Smith vs. Johnson Auto Accident',
    caseId: 'CASE-001',
    status: 'Delivered',
    deliveredDate: '2025-10-01',
    recipient: 'John Smith',
    hasProofOfDelivery: true,
  },
  {
    id: '2',
    trackingNumber: '1Z999AA1234567890',
    carrier: 'UPS',
    caseName: 'Medical Malpractice - Garcia',
    caseId: 'CASE-002',
    status: 'In Transit',
    estimatedDelivery: '2025-10-05',
    recipient: 'Maria Garcia',
    hasProofOfDelivery: false,
  },
  {
    id: '3',
    trackingNumber: '782000000001',
    carrier: 'FedEx',
    caseName: 'Property Damage Claim - Wilson',
    caseId: 'CASE-003',
    status: 'Out for Delivery',
    estimatedDelivery: '2025-10-03',
    recipient: 'Robert Wilson',
    hasProofOfDelivery: false,
  },
  {
    id: '4',
    trackingNumber: '9205511899223345',
    carrier: 'USPS',
    caseName: 'Workers Comp - Brown',
    caseId: 'CASE-004',
    status: 'Delivered',
    deliveredDate: '2025-09-28',
    recipient: 'Sarah Brown',
    hasProofOfDelivery: true,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'In Transit': return 'bg-blue-100 text-blue-800';
    case 'Out for Delivery': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCarrierIcon = (carrier: string) => {
  switch (carrier) {
    case 'USPS': return '🇺🇸';
    case 'FedEx': return '📦';
    case 'UPS': return '🟫';
    default: return '📬';
  }
};

export default function PackagesPage() {
  const router = useRouter();
  const [selectedCarrier, setSelectedCarrier] = useState<string>('all');

  const filteredPackages = selectedCarrier === 'all'
    ? mockPackages
    : mockPackages.filter(pkg => pkg.carrier === selectedCarrier);

  const handleRetrieveProofOfDelivery = (pkg: typeof mockPackages[0]) => {
    // TODO: Implement proof of delivery retrieval
    alert(`Retrieving proof of delivery for ${pkg.trackingNumber} from ${pkg.carrier}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onAddCase={() => {}} showAddForm={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            onClick={() => router.push('/')}
            variant="secondary"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Package Tracking</h1>
          <p className="text-gray-600 mt-1">Track packages for USPS, FedEx, and UPS</p>
        </div>

        {/* Carrier Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={selectedCarrier === 'all' ? 'primary' : 'secondary'}
              onClick={() => setSelectedCarrier('all')}
            >
              All Carriers
            </Button>
            <Button
              variant={selectedCarrier === 'USPS' ? 'primary' : 'secondary'}
              onClick={() => setSelectedCarrier('USPS')}
            >
              🇺🇸 USPS
            </Button>
            <Button
              variant={selectedCarrier === 'FedEx' ? 'primary' : 'secondary'}
              onClick={() => setSelectedCarrier('FedEx')}
            >
              📦 FedEx
            </Button>
            <Button
              variant={selectedCarrier === 'UPS' ? 'primary' : 'secondary'}
              onClick={() => setSelectedCarrier('UPS')}
            >
              🟫 UPS
            </Button>
          </div>
        </div>

        {/* Packages Table */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Tracked Packages</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getCarrierIcon(pkg.carrier)}</span>
                          <span className="text-sm font-medium text-gray-900">{pkg.carrier}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {pkg.trackingNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{pkg.caseName}</div>
                          <div className="text-sm text-gray-500">{pkg.caseId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(pkg.status)}>
                          {pkg.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pkg.status === 'Delivered' ? (
                          <div>
                            <div>Delivered: {new Date(pkg.deliveredDate!).toLocaleDateString()}</div>
                            <div className="text-gray-500">To: {pkg.recipient}</div>
                          </div>
                        ) : (
                          <div>
                            <div>Est. Delivery: {new Date(pkg.estimatedDelivery!).toLocaleDateString()}</div>
                            <div className="text-gray-500">To: {pkg.recipient}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {pkg.status === 'Delivered' && pkg.hasProofOfDelivery && (
                          <Button
                            size="sm"
                            onClick={() => handleRetrieveProofOfDelivery(pkg)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            📄 Get POD
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPackages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No packages found for the selected carrier.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">✓</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockPackages.filter(p => p.status === 'Delivered').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">🚚</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">In Transit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockPackages.filter(p => p.status === 'In Transit').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">📦</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Out for Delivery</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockPackages.filter(p => p.status === 'Out for Delivery').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}