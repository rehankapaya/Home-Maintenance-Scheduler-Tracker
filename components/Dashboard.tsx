
import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface DashboardProps {
  tasks: Task[];
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskList: React.FC<{title: string, tasks: Task[], onDelete: (taskId: string) => void, onToggleComplete: (taskId: string) => void, onEdit: (task: Task) => void}> = ({ title, tasks, onDelete, onToggleComplete, onEdit }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{title} ({tasks.length})</h2>
        {tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map(task => (
                <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-12 px-6 bg-white dark:bg-dark-card rounded-lg shadow-sm">
                <p className="text-gray-500 dark:text-gray-400">No tasks here. Enjoy the quiet time!</p>
            </div>
        )}
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ tasks, onDelete, onToggleComplete, onEdit }) => {
  const upcomingTasks = tasks.filter(task => !task.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completedTasks = tasks.filter(task => task.completed).sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime());

  return (
    <div className="space-y-10">
      <TaskList 
        title="Upcoming & Overdue"
        tasks={upcomingTasks}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
      />
      <TaskList 
        title="Completed"
        tasks={completedTasks}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
      />
    </div>
  );
};
