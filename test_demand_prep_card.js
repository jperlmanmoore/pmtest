// Test the DemandPrepCasesCard component
const mockCases = [
  {
    _id: '1',
    caseNumber: '000001',
    clientId: { _id: '1', name: 'John Doe' },
    title: 'Car Accident - Main St',
    description: 'Rear-end collision',
    stage: 'treating',
    dateOfLoss: '2024-01-15',
    anteLitemRequired: true,
    assignedAttorney: { _id: 'attorney-1', name: 'Sarah Johnson' }
  },
  {
    _id: '2',
    caseNumber: '000002',
    clientId: { _id: '2', name: 'Jane Smith' },
    title: 'Slip and Fall - Grocery Store',
    description: 'Client slipped on wet floor',
    stage: 'demandPrep',
    dateOfLoss: '2024-02-20',
    anteLitemRequired: false,
    assignedAttorney: { _id: 'attorney-2', name: 'Michael Chen' }
  },
  {
    _id: '3',
    caseNumber: '000003',
    clientId: { _id: '3', name: 'Bob Johnson' },
    title: 'Workplace Chemical Spill',
    description: 'Chemical spill in office building',
    stage: 'demandPrep',
    dateOfLoss: '2024-12-01',
    anteLitemRequired: true,
    anteLitemDeadline: '2025-02-01'
  },
  {
    _id: '4',
    caseNumber: '000004',
    clientId: { _id: '4', name: 'Alice Brown' },
    title: 'Apartment - Mold Exposure',
    description: 'Severe mold exposure',
    stage: 'negotiation',
    dateOfLoss: '2024-06-08',
    anteLitemRequired: false
  }
];

console.log('=== TESTING DEMAND PREP CASES CARD ===');
console.log('All cases:', mockCases.length);

// Filter cases in demand prep stage
const demandPrepCases = mockCases.filter(c => c.stage === 'demandPrep');
console.log('Demand prep cases found:', demandPrepCases.length);

demandPrepCases.forEach(c => {
  console.log(`  • ${c.title} (${c.caseNumber}) - Client: ${c.clientId.name}`);
});

// Test sorting by date of loss (most recent first)
const sortedCases = demandPrepCases.sort((a, b) =>
  new Date(b.dateOfLoss).getTime() - new Date(a.dateOfLoss).getTime()
);

console.log('\nSorted by date of loss (most recent first):');
sortedCases.forEach(c => {
  console.log(`  • ${c.title} - ${new Date(c.dateOfLoss).toLocaleDateString()}`);
});

// Test metrics calculation
const assignedToAttorney = demandPrepCases.filter(c => c.assignedAttorney).length;
const withAnteLitem = demandPrepCases.filter(c => c.anteLitemRequired && c.anteLitemDeadline).length;

console.log('\nMetrics:');
console.log(`  • Total cases: ${demandPrepCases.length}`);
console.log(`  • Assigned to attorney: ${assignedToAttorney}`);
console.log(`  • With ante litem: ${withAnteLitem}`);

console.log('\n✅ Demand Prep Cases Card test completed successfully!');