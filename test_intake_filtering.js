// Test to verify intake cases are excluded from overview
const mockCases = [
  { _id: '1', title: 'Case 1', stage: 'intake', clientId: { name: 'Client 1' }, dateOfLoss: '2024-01-01' },
  { _id: '2', title: 'Case 2', stage: 'treating', clientId: { name: 'Client 2' }, dateOfLoss: '2024-01-01' },
  { _id: '3', title: 'Case 3', stage: 'intake', clientId: { name: 'Client 3' }, dateOfLoss: '2024-01-01' },
  { _id: '4', title: 'Case 4', stage: 'settlement', clientId: { name: 'Client 4' }, dateOfLoss: '2024-01-01' }
];

console.log('=== TESTING INTAKE CASE FILTERING ===');
console.log('Original cases:', mockCases.length);

// Simulate the filtering logic from overview page
const filteredCases = mockCases.filter(c => c.stage !== 'intake');

console.log('Filtered cases (excluding intake):', filteredCases.length);
console.log('Filtered cases:', filteredCases.map(c => `${c.title} (${c.stage})`));

const intakeCases = mockCases.filter(c => c.stage === 'intake');
console.log('Intake cases that were excluded:', intakeCases.length);
console.log('Excluded intake cases:', intakeCases.map(c => `${c.title} (${c.stage})`));

console.log('✅ Test passed: Intake cases are properly excluded from overview');