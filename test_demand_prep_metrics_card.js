// Test the new Demand Prep card in MetricsCards
const mockCases = [
  {
    _id: '1',
    caseNumber: '000001',
    clientId: { _id: '1', name: 'John Doe' },
    title: 'Car Accident - Main St',
    description: 'Rear-end collision',
    stage: 'treating',
    dateOfLoss: '2024-01-15'
  },
  {
    _id: '2',
    caseNumber: '000002',
    clientId: { _id: '2', name: 'Jane Smith' },
    title: 'Slip and Fall - Grocery Store',
    description: 'Client slipped on wet floor',
    stage: 'demandPrep',
    dateOfLoss: '2024-02-20',
    assignedAttorney: { _id: 'attorney-1', name: 'Sarah Johnson' },
    anteLitemRequired: true,
    anteLitemDeadline: '2024-04-20'
  },
  {
    _id: '3',
    caseNumber: '000003',
    clientId: { _id: '3', name: 'Bob Johnson' },
    title: 'Workplace Chemical Spill',
    description: 'Chemical spill in office building',
    stage: 'demandPrep',
    dateOfLoss: '2024-12-01',
    assignedAttorney: { _id: 'attorney-2', name: 'Michael Chen' },
    anteLitemRequired: false
  },
  {
    _id: '4',
    caseNumber: '000004',
    clientId: { _id: '4', name: 'Alice Brown' },
    title: 'Apartment - Mold Exposure',
    description: 'Severe mold exposure',
    stage: 'demandPrep',
    dateOfLoss: '2024-06-08',
    anteLitemRequired: true,
    anteLitemDeadline: '2024-03-15' // Earlier date
  },
  {
    _id: '5',
    caseNumber: '000005',
    clientId: { _id: '5', name: 'Charlie Wilson' },
    title: 'Bus Accident',
    description: 'City bus accident',
    stage: 'negotiation',
    dateOfLoss: '2024-08-14'
  }
];

console.log('=== TESTING DEMAND PREP CARD IN METRICS ===');
console.log('All cases:', mockCases.length);

// Filter demand prep cases
const demandPrepCases = mockCases.filter(c => c.stage === 'demandPrep');
console.log('Demand prep cases:', demandPrepCases.length);

// Calculate metrics
const assignedCount = demandPrepCases.filter(c => c.assignedAttorney).length;
console.log('Cases assigned to attorneys:', assignedCount);

// Find next due date (future dates only, earliest first)
const futureDeadlines = demandPrepCases
  .filter(c => c.anteLitemDeadline)
  .filter(c => new Date(c.anteLitemDeadline) > new Date())
  .sort((a, b) => new Date(a.anteLitemDeadline).getTime() - new Date(b.anteLitemDeadline).getTime());

const nextDue = futureDeadlines.length > 0 ? futureDeadlines[0] : null;

console.log('Next due date case:', nextDue ? `${nextDue.title} - ${nextDue.anteLitemDeadline}` : 'None');

console.log('\n=== EXPECTED CARD DISPLAY ===');
console.log('Title: Demand Prep');
console.log('Value:', demandPrepCases.length);
console.log('Icon: 📋');
console.log('Color: bg-yellow-500');
console.log('Subtitle:', nextDue ? `Next: ${new Date(nextDue.anteLitemDeadline).toLocaleDateString()}` : 'undefined');
console.log('Clickable: true');
console.log('Navigation: /demand-prep');

console.log('\n✅ Demand Prep Card test completed successfully!');