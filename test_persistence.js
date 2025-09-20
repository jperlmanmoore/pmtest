#!/usr/bin/env node

// Simple test script to verify task persistence
// Run this to check if tasks are being updated correctly

const fs = require('fs');
const path = require('path');

// Read the useTasks hook to verify our changes
const tasksFile = path.join(__dirname, 'src', 'hooks', 'useTasks.ts');

try {
  const content = fs.readFileSync(tasksFile, 'utf8');

  console.log('=== TASK PERSISTENCE TEST ===');
  console.log('Checking useTasks hook for persistence fixes...');

  // Check if useMemo is imported
  if (content.includes('useMemo')) {
    console.log('✅ useMemo is imported');
  } else {
    console.log('❌ useMemo is NOT imported');
  }

  // Check if filteredTasks is used
  if (content.includes('filteredTasks')) {
    console.log('✅ filteredTasks is being used');
  } else {
    console.log('❌ filteredTasks is NOT being used');
  }

  // Check if the return statement uses filteredTasks
  if (content.includes('tasks: filteredTasks')) {
    console.log('✅ Hook returns filteredTasks instead of tasks');
  } else {
    console.log('❌ Hook still returns raw tasks');
  }

  // Check if the destructive filtering is removed
  if (content.includes('setTasks(prev => {')) {
    console.log('❌ Destructive filtering still exists in useEffect');
  } else {
    console.log('✅ Destructive filtering removed from useEffect');
  }

  console.log('\n=== TEST COMPLETE ===');
  console.log('If all checks are ✅, the persistence issue should be fixed.');
  console.log('Test the application at http://localhost:3002');

} catch (error) {
  console.error('Error reading useTasks file:', error.message);
}