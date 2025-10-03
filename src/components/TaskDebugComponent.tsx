'use client';

import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';

export default function TaskDebugComponent() {
  const { tasks, updateTask, loading } = useTasks();

  const handleTestUpdate = async () => {
    console.log('=== TASK DEBUG COMPONENT BUTTON CLICKED ===');
    console.log('Tasks available:', tasks.length);

    if (tasks.length > 0) {
      const firstTask = tasks[0];
      console.log('=== TEST UPDATE DEBUG ===');
      console.log('First task:', firstTask);
      console.log('Current status:', firstTask.status);

      const newStatus = firstTask.status === 'pending' ? 'completed' : 'pending';
      console.log('New status:', newStatus);
      console.log('About to call updateTask with:', firstTask._id, { status: newStatus });

      try {
        await updateTask(firstTask._id, { status: newStatus });
        console.log('Test update completed successfully');
      } catch (error) {
        console.error('Test update failed:', error);
      }
    } else {
      console.log('No tasks available to update');
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded m-4">
      <h3 className="text-lg font-bold mb-4">Task Debug Component</h3>
      <p>Total tasks: {tasks.length}</p>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <button
        onClick={handleTestUpdate}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={tasks.length === 0}
      >
        Test Update First Task
      </button>
      <div className="mt-4">
        <h4 className="font-semibold">First 3 Tasks:</h4>
        <ul className="text-sm">
          {tasks.slice(0, 3).map((task: Task) => (
            <li key={task._id}>
              {task.title} - {task.status} (Case: {task.caseId})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}