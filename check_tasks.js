const TASK_COLUMNS_BY_STAGE = {
  intake: [
    'Initial Call',
    'Review Contract',
    '15 Day Case Review'
  ],
  opening: [
    'AR',
    'HI Cards',
    'HI Ltr',
    'HI Subro'
  ],
  treating: [
    'Initial Med Recs',
    'Bill HI Ltr',
    'PD Resolved',
    '30 Day Call'
  ],
  demandPrep: [
    'LOR Liability',
    'LOR UM',
    'Dec Page L',
    'Dec Page UM',
    'ACM',
    'All Bills/Recs',
    'Draft Demand'
  ],
  negotiation: [
    'Send Liability Demand',
    'Send UM Demand',
    'Med Pay Demand'
  ],
  settlement: [],
  resolution: [],
  probate: [],
  closed: []
};

const TASK_COLUMNS = Object.values(TASK_COLUMNS_BY_STAGE).flat();
console.log('Total TASK_COLUMNS:', TASK_COLUMNS.length);
console.log('TASK_COLUMNS:');
TASK_COLUMNS.forEach((task, index) => {
  console.log(`${index + 1}. ${task}`);
});
console.log('\nEmpty stages:', Object.entries(TASK_COLUMNS_BY_STAGE).filter(([stage, tasks]) => tasks.length === 0).map(([stage]) => stage));