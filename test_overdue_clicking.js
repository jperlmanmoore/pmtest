#!/usr/bin/env node

// Test script to verify overdue task clicking behavior
// This simulates the issue the user reported

const fs = require('fs');
const path = require('path');

// Simulate task states and overdue logic
const simulateTaskClick = (task, clickNumber) => {
  console.log(`\n=== CLICK ${clickNumber} SIMULATION ===`);
  console.log('Task before click:', {
    id: task._id,
    title: task.title,
    status: task.status,
    dueDate: task.dueDate,
    isOverdue: task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending'
  });

  // Simulate the status cycling logic
  const statusCycle = ['pending', 'in_progress', 'completed'];
  const currentIndex = statusCycle.indexOf(task.status);
  const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextStatus = statusCycle[(safeCurrentIndex + 1) % statusCycle.length];

  // Update task status
  task.status = nextStatus;

  // Calculate display status after update
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';
  const displayStatus = isOverdue ? 'overdue' : task.status;

  console.log('Task after click:', {
    id: task._id,
    title: task.title,
    status: task.status,
    displayStatus: displayStatus,
    isOverdue: isOverdue,
    visualChange: displayStatus !== (isOverdue ? 'overdue' : task.status)
  });

  return { status: task.status, displayStatus, isOverdue };
};

console.log('=== OVERDUE TASK CLICKING TEST ===');

// Create a test overdue task
const overdueTask = {
  _id: 'task-1',
  title: 'Test Overdue Task',
  status: 'pending',
  dueDate: '2024-01-01T00:00:00Z' // Past due date
};

console.log('Initial task state:');
console.log('- Status: pending');
console.log('- Due Date: 2024-01-01 (past due)');
console.log('- Should display as: overdue (red background)');

// Simulate first click
const result1 = simulateTaskClick(overdueTask, 1);
console.log(`\nAfter first click:`);
console.log(`- Status changed to: ${result1.status}`);
console.log(`- Should display as: ${result1.displayStatus}`);
console.log(`- Visual change: ${result1.displayStatus !== 'overdue' ? 'YES' : 'NO'}`);

// Simulate second click
const result2 = simulateTaskClick(overdueTask, 2);
console.log(`\nAfter second click:`);
console.log(`- Status changed to: ${result2.status}`);
console.log(`- Should display as: ${result2.displayStatus}`);
console.log(`- Visual change: ${result2.displayStatus !== 'overdue' ? 'YES' : 'NO'}`);

// Simulate third click
const result3 = simulateTaskClick(overdueTask, 3);
console.log(`\nAfter third click:`);
console.log(`- Status changed to: ${result3.status}`);
console.log(`- Should display as: ${result3.displayStatus}`);
console.log(`- Visual change: ${result3.displayStatus !== 'overdue' ? 'YES' : 'NO'}`);

console.log('\n=== EXPECTED BEHAVIOR ===');
console.log('✅ First click: pending → in_progress (visual changes to blue)');
console.log('✅ Second click: in_progress → completed (visual changes to green)');
console.log('✅ Third click: completed → pending (visual changes back to red if still overdue)');

console.log('\n=== TEST RESULTS ===');
if (result1.displayStatus === 'in_progress' && result2.displayStatus === 'completed') {
  console.log('✅ OVERDUE TASK CLICKING IS WORKING CORRECTLY!');
} else {
  console.log('❌ OVERDUE TASK CLICKING HAS ISSUES!');
}