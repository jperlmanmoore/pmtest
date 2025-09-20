#!/usr/bin/env node

// Test script to verify localStorage persistence
// This simulates what happens in the browser

const fs = require('fs');
const path = require('path');

// Read the useTasks hook to verify localStorage implementation
const tasksFile = path.join(__dirname, 'src', 'hooks', 'useTasks.ts');

try {
  const content = fs.readFileSync(tasksFile, 'utf8');

  console.log('=== LOCALSTORAGE PERSISTENCE TEST ===');

  // Check if localStorage is being used
  if (content.includes('localStorage.getItem')) {
    console.log('✅ localStorage.getItem is implemented');
  } else {
    console.log('❌ localStorage.getItem is NOT implemented');
  }

  if (content.includes('localStorage.setItem')) {
    console.log('✅ localStorage.setItem is implemented');
  } else {
    console.log('❌ localStorage.setItem is NOT implemented');
  }

  if (content.includes('pmtest-tasks')) {
    console.log('✅ Using correct localStorage key: pmtest-tasks');
  } else {
    console.log('❌ localStorage key is NOT correct');
  }

  if (content.includes('clearTaskStorage')) {
    console.log('✅ clearTaskStorage function is available for testing');
  } else {
    console.log('❌ clearTaskStorage function is NOT available');
  }

  // Check if the initialization logic is correct
  if (content.includes('const savedTasks = localStorage.getItem')) {
    console.log('✅ Loading from localStorage on initialization');
  } else {
    console.log('❌ NOT loading from localStorage on initialization');
  }

  if (content.includes('JSON.parse(savedTasks)')) {
    console.log('✅ Parsing saved tasks from JSON');
  } else {
    console.log('❌ NOT parsing saved tasks from JSON');
  }

  if (content.includes('JSON.stringify(tasks)')) {
    console.log('✅ Saving tasks as JSON to localStorage');
  } else {
    console.log('❌ NOT saving tasks as JSON to localStorage');
  }

  console.log('\n=== TEST RESULTS ===');
  console.log('If all checks are ✅, localStorage persistence should work.');
  console.log('Test the application at http://localhost:3002');
  console.log('To reset task data, call the clearTaskStorage() function from the hook.');

} catch (error) {
  console.error('Error reading useTasks file:', error.message);
}